const React = require('react');
const connect = require('react-redux').connect;
const selectedMatchSelector = require('../selectors/selectedMatch');
const namePartsMap = require('../selectors/namePartsMap');

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
          <input type="text" placeholder="Given Name" 
            value={this.calculateValue('http://gedcomx.org/Given')}
            onChange={this.changeHandler('http://gedcomx.org/Given').bind(this)} />
          <input type="text" placeholder="Family Name" 
            value={this.calculateValue('http://gedcomx.org/Surname')}
            onChange={this.changeHandler('http://gedcomx.org/Surname').bind(this)} />
        </div>
      </div>  
    );
  }
  
  changeHandler(type){
    return (event) => {
      this.props.dispatch({
        type: 'OVERRIDE_NAMEPART',
        value: event.target.value,
        partType: type,
        personId: this.props.personId
      });
    };
  }
  
  calculateValue(partType){
    return this.props.overrideParts[partType] || this.props.copiedParts[partType] || this.props.originalParts[partType];
  }
}

const mapStateToProps = (state, props) => {
  const match = selectedMatchSelector(state);
  return {
    copied: match.copyName,
    copiedParts: match.copyName ? namePartsMap(state.persons[state.currentPerson].getPreferredName()) : {},
    originalParts: namePartsMap(props.name),
    overrideParts: match.overrideName,
    personId: state.currentPerson
  };
};

module.exports = connect(mapStateToProps)(EditableName);