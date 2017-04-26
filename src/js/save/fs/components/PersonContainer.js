const React = require('react');
const RecordPerson = require('./RecordPerson');
const PersonMatches = require('./PersonMatches');

const PersonContainer = function(props){
  return (
    <div className="row">
      <div className="col-md-6">
        <RecordPerson />
      </div>
      <div className="col-md-6">
        <PersonMatches />
      </div>
    </div>
  );
};

module.exports = PersonContainer;
