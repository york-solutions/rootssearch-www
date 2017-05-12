/**
 * Modal that shows a button the user needs to click so that the auth popup
 * is opened synchronously after a user action instead of async after an
 * API request.
 */

const React = require('react');
const connect = require('react-redux').connect;

const FSAuthModal = require('./FSAuthModal');

const ModalRouter = function(props){
  switch(props.modal){
    
    case 'FS_AUTH':
      return <FSAuthModal />;
    
    default:
      return null;
  }
};

const mapStateToProps = state => {
  return {
    modal: state.modal
  };
};

module.exports = connect(mapStateToProps)(ModalRouter);