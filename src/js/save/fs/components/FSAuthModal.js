/**
 * Modal that shows a button the user needs to click so that the auth popup
 * is opened synchronously after a user action instead of async after an
 * API request.
 */

const React = require('react');
const connect = require('react-redux').connect;

const FSAuthModal = function(props){
  return (
    <div className="modal-fade fs-auth">
      <div className="modal-container">
        <div className="modal-body">
          <p>Please sign in to FamilySearch.</p>
          <button className="btn btn-rs btn-lg" onClick={props.onClick}>Sign In</button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    onClick: state.auth.onClick
  };
};

module.exports = connect(mapStateToProps)(FSAuthModal);