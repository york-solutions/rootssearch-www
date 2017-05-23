/**
 * Display attribution.
 */

const React = require('react');
const dateUtils = require('../utils/date');

const Attribution = function({attribution}){
  if(attribution === undefined){
    return null;
  }
  return (
    <div className="attribution">
      <div className="contributor">{contributorDisplay(attribution)}</div>
      <div className="reason">Reason: {attribution && attribution.getChangeMessage()}</div>
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

module.exports = Attribution;