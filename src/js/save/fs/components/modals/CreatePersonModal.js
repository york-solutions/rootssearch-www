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
const ModalWrapper = require('./ModalWrapper');

class CreatePersonModal extends React.Component {
  
  constructor(props){
    super(props);
  }
  
  render(){
    return (
      <ModalWrapper title="Create A New Person">
        <div>
          <div className="label">Name</div>
          
        </div>
        <p>Create A Person</p>
      </ModalWrapper>
    );
  }

}

const mapStateToProps = state => {
  return {};
};

module.exports = connect(mapStateToProps)(CreatePersonModal);