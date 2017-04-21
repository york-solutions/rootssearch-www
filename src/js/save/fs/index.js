const React = require('react'),
      ReactDOM = require('react-dom'),
      store = require('./store'),
      loaded = require('../../loaded'),
      App = require('./components/App');
      
function render(){
  ReactDOM.render(
    <div>
      <App />
      <div id="fs-auth"></div>
    </div>,
    document.getElementById('app')
  );
}

store.subscribe(render);
render();
loaded();

require('./fs').get('/platform/users/current', function(){});