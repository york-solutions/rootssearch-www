const React = require('react');
const connect = require('react-redux').connect;
const RecordPerson = require('./RecordPerson');
const MatchesList = require('./MatchesList');
const SelectedMatch = require('./SelectedMatch');
const matchedSelector = require('../selectors/matched');

const PersonContainer = function({ matched }){
  return (
    <div className="row">
      <div className="col-md-6">
        <RecordPerson />
      </div>
      <div className="col-md-6">
        { matched ? <SelectedMatch /> : <MatchesList /> }
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    matched: matchedSelector(state)
  };
};

module.exports = connect(mapStateToProps)(PersonContainer);
