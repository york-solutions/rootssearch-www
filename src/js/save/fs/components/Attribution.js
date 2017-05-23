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
      {contributorDisplay(attribution)}. Reason: {attribution && attribution.getChangeMessage()}
    </div>
  );
};

function contributorDisplay(attribution){
  if(attribution){
    const date = dateUtils.displayString(new Date(attribution.getModified())),
          contributor = attribution.getContributor();
    return `Last modified ${date} ${contributor ? ' by ' + contributor.getResourceId() : ''}`;
  }
  return null;
}

module.exports = Attribution;