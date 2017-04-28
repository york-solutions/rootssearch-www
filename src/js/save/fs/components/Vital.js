/**
 * Display a vital fact.
 */

const React = require('react');
const matched = require('../selectors/matched');
const connect = require('react-redux').connect;
const FactCopyBox = require('./FactCopyBox');

const Vital = function({fact, copyable, matched}){
  if(!fact){
    return null;
  }
  return (
    <div className="vital">
      {copyable && matched && <FactCopyBox fact={fact} />}
      <span className="label">{fact.getType().split('/').pop()}</span>
      <div>{fact.getDateDisplayString()}</div>
      <div>{fact.getPlaceDisplayString()}</div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    matched: matched(state)
  };
};

module.exports = connect(mapStateToProps)(Vital);