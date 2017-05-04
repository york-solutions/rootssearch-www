/**
 * Input box for editing fact dates on selected matches.
 */

const React = require('react');
const connect = require('react-redux').connect;

class DateInput extends React.Component {
    
  render() {
    return <input type="text" value={this.calculateValue()} placeholder="Date" onChange={this.handleChange.bind(this)} />;
  }
  
  calculateValue() {
    return this.props.override || this.props.fact.getDateDisplayString();
  }
  
  handleChange(e){
    this.props.dispatch({
      type: 'OVERRIDE_DATE',
      value: e.target.value,
      dataId: this.props.fact.getId(),
      personId: this.props.personId
    });
  }
  
}

module.exports = connect((state, props) => {
  const match = state.selectedMatches[state.currentPerson],
        factId = props.fact.getId();
  return {
    override: match.overrideDates[factId]
  };
})(DateInput);