const React = require('react');
const connect = require('react-redux').connect;
const Loader = require('./Loader');
const RecordPerson = require('./RecordPerson');
const SelectedMatch = require('./SelectedMatch');
const selectedMatchSelector = require('../selectors/selectedMatch');

const MatchContainer = function({ loading }){
  return (
    <div className="row">
      <div className="col-md-6">
        <RecordPerson />
      </div>
      <div className="col-md-6">
        {loading ? <Loader message="Loading match..." /> : <SelectedMatch />}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const match = selectedMatchSelector(state);
  return {
    loading: match.loading
  };
};

module.exports = connect(mapStateToProps)(MatchContainer);
