/**
 * Input box for editing fact dates on selected matches.
 */

const React = require('react');
const connect = require('react-redux').connect;
const selectedMatchSelector = require('../selectors/selectedMatch');

class PlaceInput extends React.Component {
    
  constructor(props){
    super(props);
    const factId = this.props.fact.getId();
    this.state = {
      factId
    };
  }
    
  render() {
    return <input type="text" value={this.calculateValue()} placeholder="Place" onChange={this.handleChange.bind(this)} />;
  }
  
  calculateValue() {
    return this.props.overridePlaces[this.state.factId] || this.props.fact.getPlaceDisplayString();
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

module.exports = connect(state => {
  const match = selectedMatchSelector(state);
  return {
    overridePlaces: match.overridePlaces
  };
})(PlaceInput);