/**
 * Input box for editing fact dates on selected matches.
 */

const React = require('react');
const Autosuggest = require('react-autosuggest');
const FS = require('../utils/fs');

const renderSuggestion = suggestion => (
  <div>{suggestion}</div>
);
const getSuggestionValue = suggestion => suggestion;

class PlaceInput extends React.Component {
    
  constructor(props){
    super(props);
    this.state = {
      suggestions: []
    };
  }   
    
  render() {
    const {place} = this.props;
    const inputProps = {
      value: place ? place.getDisplayString() : '',
      onChange: this.handleChange.bind(this),
      placeholder: 'Place'
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
    FS.get(`/platform/places/search?q=name:"${value}"`, {
      headers: {
        Accept: 'application/x-gedcomx-atom+json'
      }
    }, (error, response) => {
      // TODO: error handling
      if(error){
        console.error('PlaceInput', error);
      }
      if(response){
        this.setState({
          // Limit suggestions to 5 then map them to just the full place name
          suggestions: response.gedcomx.getEntries().slice(0,5).map(entry => {
            return entry.getContent().getGedcomX().getPlaces()[0].getDisplay().getFullName();
          })
        });
      }
    });
  }
  
  suggestionSelected(event, {suggestion}) {
    this.props.onChange({
      original: suggestion
    });
  }
  
  handleChange(e){
    this.props.onChange({
      original: e.target.value,
    });
  }
  
}

module.exports = PlaceInput;