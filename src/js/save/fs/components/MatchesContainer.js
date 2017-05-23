const React = require('react');
const RecordPerson = require('./RecordPerson');
const MatchesList = require('./MatchesList');

const MatchesContainer = function(){
  return (
    <div className="row">
      <div className="col-md-6">
        <RecordPerson />
      </div>
      <div className="col-md-6">
        <MatchesList /> 
      </div>
    </div>
  );
};

module.exports = MatchesContainer;
