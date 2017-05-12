const React = require('react');
const connect = require('react-redux').connect;
const ModalWrapper = require('./ModalWrapper');

const CreatePersonModal = function(props){
  return (
    <ModalWrapper>
      <p>Create A Person</p>
    </ModalWrapper>
  );
};

const mapStateToProps = state => {
  return {};
};

module.exports = connect(mapStateToProps)(CreatePersonModal);