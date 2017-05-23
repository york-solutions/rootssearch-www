const React = require('react');
const CopyBox = require('./CopyBox');

const Name = function({name, copyable=false, copied=false, onCopyChange}){
  return (
    <div className="person-name conclusion">
      <div className="label">Name</div>
      <div className="name-line conclusion-line">
        { copyable && <CopyBox dataId={name.getId()} onChange={onCopyChange} copied={copied} /> }
        <div className="name-detail">{name.getFullText()}</div>
      </div>
    </div>  
  );
};

module.exports = Name;