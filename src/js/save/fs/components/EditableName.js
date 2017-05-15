const React = require('react');
const connect = require('react-redux').connect;

const EditableName = function({nameParts, onChange}){
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
    </div>  
  );
};

module.exports = connect()(EditableName);