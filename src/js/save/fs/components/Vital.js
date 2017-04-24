/**
 * Display a vital fact.
 */

const React = require('react');

module.exports = function({fact}){
  if(!fact){
    return null;
  }
  return (
    <div className="vital">
      <span className="label">{fact.getType().split('/').pop()}</span>
      <div>{fact.getDateDisplayString()}</div>
      <div>{fact.getPlaceDisplayString()}</div>
    </div>
  );
};