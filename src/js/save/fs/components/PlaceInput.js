/**
 * Input box for editing fact dates on selected matches.
 */

const React = require('react');
const connect = require('react-redux').connect;
const placeOverrideSelector = require('../selectors/placeOverride');
const placeCopySelector = require('../selectors/placeCopy');

class PlaceInput extends React.Component {
    
  render() {
    return <input type="text" value={this.calculateValue()} placeholder="Place" onChange={this.handleChange.bind(this)} />;
  }
  
  calculateValue() {
    return this.props.override || this.props.copy || this.props.fact.getPlaceDisplayString() || '';
  }
  
  handleChange(e){
    this.props.dispatch({
      type: 'OVERRIDE_PLACE',
      value: e.target.value,
      dataId: this.props.fact.getId(),
      personId: this.props.personId
    });
  }
  
}

module.exports = connect((state, props) => {
  const factId = props.fact.getId(),
        override = placeOverrideSelector(state, factId),
        copy = placeCopySelector(state, props.recordFactId);
  return {
    override,
    copy
  };
})(PlaceInput);