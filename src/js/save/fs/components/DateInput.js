/**
 * Input box for editing fact dates on selected matches.
 */

const React = require('react');
const connect = require('react-redux').connect;
const dateOverrideSelector = require('../selectors/dateOverride');
const dateCopySelector = require('../selectors/dateCopy');

class DateInput extends React.Component {
    
  render() {
    return <input type="text" value={this.calculateValue()} placeholder="Date" onChange={this.handleChange.bind(this)} />;
  }
  
  calculateValue() {
    return this.props.override || this.props.copy || this.props.fact.getDateDisplayString();
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

const mapStateToProps = (state, props) => {
  const factId = props.fact.getId(),
        override = dateOverrideSelector(state, factId),
        copy = dateCopySelector(state, factId);
  return {
    override,
    copy
  };
};

module.exports = connect(mapStateToProps)(DateInput);