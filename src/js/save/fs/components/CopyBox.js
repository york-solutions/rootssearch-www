const React = require('react');

class CopyBox extends React.Component {
  
  render(){
    return (
      <input type="checkbox" className="copy-box" onChange={this.onChange.bind(this)} />
    );
  }
  
  onChange(e){
    this.props.onChange({
      dataId: this.props.dataId,
      copy: e.target.checked
    });
  }
  
}

module.exports = CopyBox;