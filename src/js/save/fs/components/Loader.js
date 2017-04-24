const React = require('react');

module.exports = function({message}){
  return (
    <div className="loader">
      <img src="/assets/img/loader.svg" />
      {message && <p>{message}</p>}
    </div>
  );
};