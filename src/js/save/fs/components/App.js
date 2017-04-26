const React = require('react');
const connect = require('react-redux').connect;
const StatusBar = require('./StatusBar');
const RecordPerson = require('./RecordPerson');
const PersonMatches = require('./PersonMatches');
const FSAuthModal = require('./FSAuthModal');

class App extends React.Component {
  
  // TODO: if we have no persons then show an error
  
  render() {
    const { auth } = this.props;
    
    return (
      <div>
        <StatusBar />
        <div className="row">
          <div className="col-md-6">
            <RecordPerson />
          </div>
          <div className="col-md-6">
            <PersonMatches />
          </div>
        </div>
        { auth.inProgress ? <FSAuthModal /> : null }
      </div>
    );
  }
  
}

module.exports = connect(state => {
  return {
    auth: state.auth
  };
})(App);