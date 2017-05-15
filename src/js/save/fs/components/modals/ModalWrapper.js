const React = require('react');

const ModalWrapper = function(props){
  return (
    <div className="modal-fade fs-auth">
      <div className="modal-container">
        {props.title ? <div className="modal-title">{props.title}</div> : null}
        <div className="modal-body">
          {props.children}
        </div>
      </div>
    </div>
  );
};

module.exports = ModalWrapper;