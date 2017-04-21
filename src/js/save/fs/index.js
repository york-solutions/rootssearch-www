const React = require('react'),
      ReactDOM = require('react-dom'),
      Provider = require('react-redux').Provider,
      store = require('./store'),
      loaded = require('../../loaded'),
      App = require('./components/App'),
      changeFocusPerson = require('./actions/changeFocusPerson');
      
function render(){
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );
}

store.subscribe(render);
render();
loaded();

store.dispatch(changeFocusPerson(0));