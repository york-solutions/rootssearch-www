/**
 * Input box for editing fact dates on selected matches.
 */

const React = require('react');
const connect = require('react-redux').connect;

const PlaceInput = function({fact, dispatch}) {
  return <input type="text" value={fact.getPlaceDisplayString()} placeholder="Place" />;
};

module.exports = connect()(PlaceInput);