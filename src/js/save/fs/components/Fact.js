/**
 * Display a vital fact.
 */

const React = require('react');
const connect = require('react-redux').connect;
const PlaceCopyBox = require('./PlaceCopyBox');
const DateCopyBox = require('./DateCopyBox');

const Fact = function({fact, copyable = false}){
  if(!fact){
    return null;
  }
  return (
    <div className="fact">
      <span className="label">{fact.getTypeDisplayLabel()}</span>
      <div className="fact-line">
        {copyable && fact.getDateDisplayString() && <DateCopyBox fact={fact} />}
        <div className="fact-piece">{fact.getDateDisplayString()}</div>
      </div>
      <div className="fact-line">
        {copyable && fact.getPlaceDisplayString() && <PlaceCopyBox fact={fact} />}
        <div className="fact-piece">{fact.getPlaceDisplayString()}</div>
      </div>
    </div>
  );
};

module.exports = connect()(Fact);