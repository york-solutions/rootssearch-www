const React = require('react');
const connect = require('react-redux').connect;
const StatusBar = require('./StatusBar');
const PersonContainer = require('./PersonContainer');
const FSAuthModal = require('./FSAuthModal');
const Loader = require('./Loader');

const App = function({ auth, busy }) {
  // TODO: if we have no persons then show an error
  return (
    <div>
      <StatusBar />
      <PersonContainer />
      { auth.inProgress ? <FSAuthModal /> : null }
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
    busy: state.busy
  };
})(App);