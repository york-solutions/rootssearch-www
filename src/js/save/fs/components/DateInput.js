/**
 * Input box for editing fact dates on selected matches.
 */

const React = require('react');
const connect = require('react-redux').connect;

class DateInput extends React.Component {
    
  constructor(props){
    super(props);
  }
    
  render() {
    return <input type="text" value={this.props.fact.getDateDisplayString()} placeholder="Date" onChange={this.handleChange.bind(this)} />;
  }
  
  handleChange(e){
    this.props.dispatch({
      type: 'OVERRIDE_DATE',
      value: e.target.value,
      factId: this.props.fact.getId()
    });
  }
  
}

module.exports = connect()(DateInput);