const React = require('react');

module.exports = function({match}){
  return (
    <div className="match box">
      {match.id}
    </div>
  );
};