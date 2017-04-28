const React = require('react');
const CopyBox = require('./CopyBox');

const NameCopyBox = function({name}){
  return (
    <CopyBox type="name" dataId={name.getId()} />
  );
};

module.exports = NameCopyBox;