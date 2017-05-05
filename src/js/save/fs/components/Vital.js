/**
 * Display a vital fact.
 */

const React = require('react');
const matched = require('../selectors/matched');
const connect = require('react-redux').connect;
const PlaceCopyBox = require('./PlaceCopyBox');
const DateCopyBox = require('./DateCopyBox');

const Vital = function({fact, copyable = false, matched = false}){
  if(!fact){
    return null;
  }
  return (
    <div className="vital">
      <span className="label">{fact.getTypeDisplayLabel()}</span>
      <div>
        {copyable && matched && fact.getDateDisplayString() && <DateCopyBox fact={fact} />}
        {fact.getDateDisplayString()}
      </div>
      <div>
        {copyable && matched && fact.getPlaceDisplayString() && <PlaceCopyBox fact={fact} />}
        {fact.getPlaceDisplayString()}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    matched: matched(state)
  };
};

module.exports = connect(mapStateToProps)(Vital);