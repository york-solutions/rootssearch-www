const React = require('react');
const CopyBox = require('./CopyBox');

const DateCopyBox = function({fact}){
  return (
    <CopyBox type="date" dataId={fact.getId()} />
  );
};

module.exports = DateCopyBox;