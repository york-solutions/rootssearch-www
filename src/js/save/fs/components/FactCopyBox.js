const React = require('react');
const CopyBox = require('./CopyBox');

const FactCopyBox = function({fact}){
  return (
    <CopyBox type="fact" dataId={fact.getId()} />
  );
};

module.exports = FactCopyBox;