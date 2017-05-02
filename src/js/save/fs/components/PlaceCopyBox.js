const React = require('react');
const CopyBox = require('./CopyBox');

const PlaceCopyBox = function({fact}){
  return (
    <CopyBox type="place" dataId={fact.getId()} />
  );
};

module.exports = PlaceCopyBox;