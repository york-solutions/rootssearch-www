/**
 * Input box for editing fact dates on selected matches.
 */

const React = require('react');
const connect = require('react-redux').connect;
const dateOverrideSelector = require('../selectors/dateOverride');
const dateNormalizedSelector = require('../selectors/dateNormalized');
const dateCopySelector = require('../selectors/dateCopy');
const Autosuggest = require('react-autosuggest');
const FS = require('../utils/fs');

const renderSuggestion = suggestion => (
  <div>{suggestion.normalized}</div>
);

const getSuggestionValue = suggestion => suggestion.normalized;

class DateInput extends React.Component {
    
  constructor(props){
    super(props);
    this.state = {
      suggestions: []
    };
  }  
    
  render() {
    const inputProps = {
      value: this.calculateValue(),
      onChange: this.handleChange.bind(this),
      placeholder: 'Date'
    };
    const suggestions = this.state.suggestions;
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.getSuggestions.bind(this)}
        onSuggestionsClearRequested={this.clearSuggestions.bind(this)}
        onSuggestionSelected={this.suggestionSelected.bind(this)}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
  
  clearSuggestions() {
    this.setState({
      suggestions: []
    });
  }
  
  getSuggestions({value}) {
    FS.get(`/platform/dates?date=${value}`, {
      headers: {
        Accept: 'text/plain'
      }
    }, (error, response) => {
      // TODO: error handling
      if(error){
        console.error('DateInput', error);
      }
      if(response){
        this.setState({
          suggestions: [
            {
              formal: response.headers.location.replace('gedcomx-date:', ''),
              normalized: response.body
            }  
          ]
        });
      }
    });
  }
  
  suggestionSelected(event, {suggestion}) {
    this.props.dispatch({
      type: 'NORMALIZED_DATE',
      value: suggestion,
      dataId: this.props.fact.getId(),
      personId: this.props.personId 
    });
  }
  
  calculateValue() {
    return this.props.normalized || this.props.override || this.props.copy || this.props.fact.getDateDisplayString() || '';
  }
  
  handleChange(e){
    this.props.dispatch({
      type: 'OVERRIDE_DATE',
      value: e.target.value,
      dataId: this.props.fact.getId(),
      personId: this.props.personId
    });
  }
  
}

const mapStateToProps = (state, props) => {
  const factId = props.fact.getId(),
        override = dateOverrideSelector(state, factId),
        copy = dateCopySelector(state, props.recordFactId),
        normalized = dateNormalizedSelector(state, factId);
  return {
    override,
    copy,
    normalized
  };
};

module.exports = connect(mapStateToProps)(DateInput);