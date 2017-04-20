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
      <div className="type">{fact.getType().split('/').pop()}</div>
      <div>{fact.getDateDisplayString()}</div>
      <div>{fact.getPlaceDisplayString()}</div>
    </div>
  );
};