const React = require('react');
const connect = require('react-redux').connect;
const StatusBar = require('./StatusBar');
const ModalRouter = require('./modals/ModalRouter');
const Loader = require('./Loader');
const MatchesContainer = require('./MatchesContainer');
const matchedSelector = require('../selectors/matched');

const App = function({ auth, busy, matched }) {
  // TODO: if we have no persons then show an error
  return (
    <div>
      <StatusBar />
      <MatchesContainer />
      <ModalRouter />
      { busy && (
        <div className="modal-fade">
          <Loader message="Saving..." /> 
        </div>
      )}
    </div>
  );
};

module.exports = connect(state => {
  return {
    auth: state.auth,
    busy: state.busy,
    matched: matchedSelector(state)
  };
})(App);