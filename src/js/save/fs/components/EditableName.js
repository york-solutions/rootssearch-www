const React = require('react');
const connect = require('react-redux').connect;

const EditableName = function({name, parts}){
  // TODO: edit Prefix and Suffic parts
  return (
    <div className="person-name">
      <div className="label">Name</div>
      <div className="name-parts-line">
        <input type="text" placeholder="Given Name" value={parts['http://gedcomx.org/Given']} />
        <input type="text" placeholder="Family Name" value={parts['http://gedcomx.org/Surname']} />
      </div>
    </div>  
  );
};

const mapStateToProps = (state, props) => {
  return {
    parts: props.name.getNameForms()[0].getParts().reduce((accumulator, part) => {
      // TODO: handle multiple parts of the same type
      accumulator[part.getType()] = part.getValue();
      return accumulator;
    }, {})
  };
};

module.exports = connect(mapStateToProps)(EditableName);