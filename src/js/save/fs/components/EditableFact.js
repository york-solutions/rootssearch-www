/**
 * Display an editable fact.
 */

const React = require('react');
const connect = require('react-redux').connect;
const DateInput = require('./DateInput');
const PlaceInput = require('./PlaceInput');
const GedcomX = require('../utils/gedcomx');
const selectedMatch = require('../selectors/selectedMatch');

const EditableFact = function({fact, recordFactId, personId, copiedDate, copiedPlace}){
  
  // If we don't have a matching fact and nothing is copied then display a placeholder
  if(!(fact || copiedDate || copiedPlace)){
    return <div className="fact-placeholder" />;
  }
  
  if(!fact){
    fact = GedcomX.Fact();
  }
  
  return (
    <div className="fact">
      <span className="label">{fact.getTypeDisplayLabel()}</span>
      <DateInput fact={fact} personId={personId} recordFactId={recordFactId} />
      <PlaceInput fact={fact} personId={personId} recordFactId={recordFactId} />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const match = selectedMatch(state);
  return {
    copiedDate: match.copiedDates[props.recordFactId],
    copiedPlace: match.copiedPlaces[props.recordFactId]
  };
};

module.exports = connect(mapStateToProps)(EditableFact);