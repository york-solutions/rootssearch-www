const React = require('react');

const EditableGender = function({gender, onChange}){
  return (
    <div className="person-gender">
      <div className="label">Gender</div>
      <div>
        <label>
          <input type="radio"
            name="gender"
            value="http://gedcomx.org/Male"
            checked={gender === 'http://gedcomx.org/Male'}
            onChange={e => onChange(e.target.value)} />
          Male
        </label>
        <label>
          <input type="radio"
            name="gender"
            value="http://gedcomx.org/Female"
            checked={gender === 'http://gedcomx.org/Female'}
            onChange={e => onChange(e.target.value)} />
          Female
        </label>
        <label>
          <input type="radio"
            name="gender"
            value="http://gedcomx.org/Unknown"
            checked={gender === 'http://gedcomx.org/Unknown'}
            onChange={e => onChange(e.target.value)} />
          Unknown
        </label>
      </div>
    </div>  
  );
};

module.exports = EditableGender;