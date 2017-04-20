const React = require('react'),
      ReactDOM = require('react-dom'),
      store = require('./store'),
      loaded = require('../../loaded'),
      App = require('./components/App');
      
function render(){
  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
}

store.subscribe(render);
render();
loaded();