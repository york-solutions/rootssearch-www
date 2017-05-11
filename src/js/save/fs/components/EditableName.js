const React = require('react');
const connect = require('react-redux').connect;
const selectedMatchSelector = require('../selectors/selectedMatch');

class EditableName extends React.Component {
  
  constructor(props){
    super(props);
  }
  
  render(){
    // TODO: edit Prefix and Suffix parts
    return (
      <div className="person-name">
        <div className="label">Name</div>
        <div className="name-parts-line">
          <input type="text" placeholder="Given Name" value={this.calculateValue('http://gedcomx.org/Given')} />
          <input type="text" placeholder="Family Name" value={this.calculateValue('http://gedcomx.org/Surname')} />
        </div>
      </div>  
    );
  }
  
  calculateValue(partType){
    return this.props.copied ? this.props.copiedParts[partType] : this.props.parts[partType];
  }
}

const mapStateToProps = (state, props) => {
  const match = selectedMatchSelector(state);
  return {
    copied: match.copyName,
    copiedParts: match.copyName ? namePartsMap(state.persons[state.currentPerson].getPreferredName()) : {},
    parts: namePartsMap(props.name)
  };
};

const namePartsMap = (name) => {
  return name.getNameForms()[0].getParts().reduce((accumulator, part) => {
    // TODO: handle multiple parts of the same type
    accumulator[part.getType()] = part.getValue();
    return accumulator;
  }, {});
};

module.exports = connect(mapStateToProps)(EditableName);