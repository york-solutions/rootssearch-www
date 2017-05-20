const React = require('react');

const PersonBoxTitle = function({person}){
  return (
    <div className="box-title">
      <span className="person-name large">{person.getDisplayName(true)}</span>
      <span className="person-id label">{person.getId()}</span>
      <br />
      <span className="life-span">{person.getLifespan(true)}</span>
    </div>  
  );
};

module.exports = PersonBoxTitle;