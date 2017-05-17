/**
 * Input box for editing fact dates on selected matches.
 */

const React = require('react');
const Autosuggest = require('react-autosuggest');
const FS = require('../utils/fs');
const GedcomX = require('../utils/gedcomx');

const renderSuggestion = suggestion => (
  <div>{suggestion.getDisplayString()}</div>
);

const getSuggestionValue = suggestion => suggestion.getDisplayString();

class DateInput extends React.Component {
    
  constructor(props){
    super(props);
    this.state = {
      suggestions: []
    };
  }  
    
  render() {
    const {date} = this.props;
    const inputProps = {
      value: date ? date.getDisplayString() : '',
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
            GedcomX.Date({
              formal: response.headers.location.replace('gedcomx-date:', ''),
              normalized: [{value: response.body}]
            })
          ]
        });
      }
    });
  }
  
  suggestionSelected(event, {suggestion}) {
    this.props.onChange(suggestion);
  }
  
  handleChange(e){
    this.props.onChange({
      original: e.target.value
    });
  }
  
}

module.exports = DateInput;