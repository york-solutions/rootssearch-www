/**
 * Input box for editing fact dates on selected matches.
 */

const React = require('react');
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
      value: this.props.date.getDisplayString(),
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
              normalized: [{value: response.body}]
            }  
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