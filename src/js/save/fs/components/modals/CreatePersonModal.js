/**
 * A modal that allows the user to set a person's name, gender, and living
 * declaration before creating them.
 * 
 * We will create a bare person first so that we can then walk the user through
 * the same match update process for saving events and relationships.
 * 
 * We're going to use local state here. We're only dealing with name,
 * gender, and the living declaration. We don't need to save that state in the
 * global store. We don't currently have a need to recover that info. It's
 * very fast for the user to select the same options if the modal is accidentally
 * closed. Using local state is easier than global state (no actions and reducers).
 */

const React = require('react');
const connect = require('react-redux').connect;
const update = require('update-immutable').default;
const ModalWrapper = require('./ModalWrapper');
const EditableName = require('../EditableName');
const EditableGender = require('../EditableGender');
const namePartsMap = require('../../selectors/namePartsMap');

class CreatePersonModal extends React.Component {
  
  constructor(props){
    super(props);
    
    this.state = {
      nameParts: props.nameParts,
      gender: props.gender
    };
  }
  
  render(){
    return (
      <ModalWrapper title="Create A New Person">
        <EditableName nameParts={this.state.nameParts} onChange={this.nameChangeHandler.bind(this)} />
        <hr />
        <EditableGender gender={this.state.gender} onChange={this.genderChangeHandler.bind(this)} />
      </ModalWrapper>
    );
  }
  
  nameChangeHandler(type){
    return (event) => {
      this.setState(update(this.state, {
        nameParts: {
          [type]: {
            $set: event.target.value
          }
        }
      }));
    };
  }
  
  genderChangeHandler(gender){
    this.setState(update(this.state, {
      gender: {
        $set: gender
      }
    }));
  }

}

const mapStateToProps = state => {
  const person = state.persons[state.currentPerson];
  return {
    nameParts: namePartsMap(person.getPreferredName()),
    gender: person.getGender().getType()
  };
};

module.exports = connect(mapStateToProps)(CreatePersonModal);