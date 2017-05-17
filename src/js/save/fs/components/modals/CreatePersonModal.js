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
const createPersonAction = require('../../actions/createPerson');
const currentPersonSelector = require('../../selectors/currentPerson');

class CreatePersonModal extends React.Component {
  
  constructor(props){
    super(props);
    
    this.state = {
      nameParts: props.nameParts,
      gender: props.gender,
      living: props.living
    };
  }
  
  render(){
    return (
      <ModalWrapper title="Create A New Person">
        <EditableName nameParts={this.state.nameParts} onChange={this.nameChangeHandler.bind(this)} />
        <hr />
        <EditableGender gender={this.state.gender} onChange={this.genderChangeHandler.bind(this)} />
        <hr />
        <div className="person-living">
          <label>
            <input type="radio"
              name="living"
              value="living"
              checked={this.state.living === true}
              onChange={this.livingChangeHandler.bind(this)} />
            Living
          </label>
          <label>
            <input type="radio"
              name="living"
              value="deceased"
              checked={this.state.living === false}
              onChange={this.livingChangeHandler.bind(this)} />
            Deceased
          </label>
        </div>
        <hr />
        <div className="toolbar">
          <button className="btn btn-rs btn-lg" onClick={this.createPerson.bind(this)}>Save</button>
          <a href onClick={this.cancel.bind(this)}>Cancel</a>
        </div>
      </ModalWrapper>
    );
  }
  
  cancel(e) {
    this.props.dispatch({
      type: 'CANCEL_CREATE_PERSON',
      personId: this.props.personId
    });
    e.preventDefault(); 
    return false; 
  }
  
  createPerson(){
    const nameParts = this.state.nameParts;
    this.props.dispatch(
      createPersonAction(this.props.personId, {
        gender: {
          type: this.state.gender
        },
        living: this.state.living,
        names: [{
          preferred: true,
          nameForms: [{
            parts: Object.keys(nameParts).map(type => {
              return {
                type,
                value: nameParts[type]
              };
            })
          }]
        }]
      })
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
  
  livingChangeHandler(event){
    this.setState(update(this.state, {
      living: {
        $set: event.target.value === 'living'
      }
    }));
  }

}

const mapStateToProps = state => {
  const person = currentPersonSelector(state).gedcomx;
  return {
    nameParts: namePartsMap(person.getPreferredName()),
    gender: person.getGender().getType(),
    living: person.getFact('http://gedcomx.org/Death') ? true : null,
    personId: state.currentPerson
  };
};

module.exports = connect(mapStateToProps)(CreatePersonModal);