const React = require('react');
const connect = require('react-redux').connect;
const StatusBar = require('./StatusBar');
const PersonContainer = require('./PersonContainer');
const FSAuthModal = require('./FSAuthModal');

const App = function({ auth }) {
  // TODO: if we have no persons then show an error
  return (
    <div>
      <StatusBar />
      <PersonContainer />
      { auth.inProgress ? <FSAuthModal /> : null }
    </div>
  );
};

module.exports = connect(state => {
  return {
    auth: state.auth
  };
})(App);