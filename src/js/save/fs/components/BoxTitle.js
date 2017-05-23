const React = require('react');
const FS = require('../utils/fs');

const BoxTitle = function(props){
  return (
    <div className="box-title">{props.children}</div>  
  );
};

module.exports = BoxTitle;