const React = require('react');
const connect = require('react-redux').connect;
const matched = require('../selectors/matched');
const NameCopyBox = require('./NameCopyBox');

const Name = function({name, copyable, matched}){
  return (
    <div className="person-name">
      <div className="label">Name</div>
      <div className="name-line">
        { copyable && matched && <NameCopyBox name={name} /> }
        <div className="name-detail">{name.getFullText()}</div>
      </div>
    </div>  
  );
};

const mapStateToProps = state => {
  return {
    matched: matched(state)
  };
};

module.exports = connect(mapStateToProps)(Name);