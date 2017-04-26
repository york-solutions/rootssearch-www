const React = require('react');

module.exports = function({person, onClick, selected = false}){
  const name = person.getDisplayName(true),
        lifespan = person.getLifespan(true);
  return <div className={'circle ' + (selected ? 'selected' : '') } title={`${name} — ${lifespan}`} onClick={onClick} />;
};