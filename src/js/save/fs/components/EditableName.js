const React = require('react');
const Attribution = require('./Attribution');
const Reason = require('./Reason');

const EditableName = function({nameParts, attribution, modified = false, reason, onChange, onReasonChange}){
  // TODO: edit Prefix and Suffix parts
  return (
    <div className="person-name">
      <div className="label">Name</div>
      <div className="name-parts-line">
        <input type="text" placeholder="Given Name" 
          value={nameParts['http://gedcomx.org/Given']}
          onChange={onChange('http://gedcomx.org/Given')} />
        <input type="text" placeholder="Family Name" 
          value={nameParts['http://gedcomx.org/Surname']}
          onChange={onChange('http://gedcomx.org/Surname')} />
      </div>
      <Attribution attribution={attribution} />
      {modified && 
        <Reason reason={reason} 
          onChange={onReasonChange} />}
    </div>  
  );
};

module.exports = EditableName;