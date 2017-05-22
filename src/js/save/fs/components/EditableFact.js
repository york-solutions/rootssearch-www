/**
 * Display an editable fact.
 */

const React = require('react');
const dateUtils = require('../utils/date');
const DateInput = require('./DateInput');
const PlaceInput = require('./PlaceInput');

const EditableFact = function({fact, onDateChange, onPlaceChange}){
  const attribution = fact.getAttribution();
  return (
    <div className="fact">
      <span className="label">{fact.getTypeDisplayLabel()}</span>
      <DateInput date={fact.getDate()} onChange={onDateChange} />
      <PlaceInput place={fact.getPlace()} onChange={onPlaceChange} />
      <div className="attribution">
        <div className="contributor">{contributorDisplay(attribution)}</div>
        <div className="reason">Reason: {attribution && attribution.getChangeMessage()}</div>
      </div>
    </div>
  );
};

function contributorDisplay(attribution){
  if(attribution){
    const date = dateUtils.displayString(new Date(attribution.getModified()));
    return `Last modified ${date} by ${attribution.getContributor().getResourceId()}.`;
  }
  return null;
}

module.exports = EditableFact;