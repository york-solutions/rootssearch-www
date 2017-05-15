const React = require('react');
const connect = require('react-redux').connect;
const RecordPerson = require('./RecordPerson');
const MatchesList = require('./MatchesList');
const SelectedMatch = require('./SelectedMatch');
const Loader = require('./Loader');
const selectedMatchSelector = require('../selectors/selectedMatch');
const matchedSelector = require('../selectors/matched');

const PersonContainer = function({ matched, loading }){
  return (
    <div className="row">
      <div className="col-md-6">
        <RecordPerson />
      </div>
      <div className="col-md-6">
        { matched ? 
          (loading ? <Loader message="Loading match..." /> : <SelectedMatch />) : 
          <MatchesList /> 
        }
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const match = selectedMatchSelector(state);
  return {
    matched: matchedSelector(state),
    loading: match.loading
  };
};

module.exports = connect(mapStateToProps)(PersonContainer);
