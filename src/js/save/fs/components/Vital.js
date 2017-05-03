/**
 * Display a vital fact.
 */

const React = require('react');
const matched = require('../selectors/matched');
const connect = require('react-redux').connect;
const PlaceCopyBox = require('./PlaceCopyBox');
const DateCopyBox = require('./DateCopyBox');
const DateInput = require('./DateInput');
const PlaceInput = require('./PlaceInput');

const Vital = function({fact, copyable = false, editable = false, matched = false}){
  if(!fact){
    return null;
  }
  return (
    <div className="vital">
      <span className="label">{fact.getType().split('/').pop()}</span>
      {editable && matched ? (
        <div>
          <DateInput fact={fact} />
          <PlaceInput fact={fact} />
        </div>
      ) : (
        <div>
          <div>
            {copyable && matched && <DateCopyBox fact={fact} />}
            {fact.getDateDisplayString()}
          </div>
          <div>
            {copyable && matched && <PlaceCopyBox fact={fact} />}
            {fact.getPlaceDisplayString()}
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    matched: matched(state)
  };
};

module.exports = connect(mapStateToProps)(Vital);