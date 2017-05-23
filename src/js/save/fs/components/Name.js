const React = require('react');
const CopyBox = require('./CopyBox');

const Name = function({name, copyable, onCopyChange}){
  return (
    <div className="person-name conclusion">
      <div className="label">Name</div>
      <div className="name-line conclusion-line">
        { copyable && <CopyBox dataId={name.getId()} onChange={onCopyChange} /> }
        <div className="name-detail">{name.getFullText()}</div>
      </div>
    </div>  
  );
};

module.exports = Name;