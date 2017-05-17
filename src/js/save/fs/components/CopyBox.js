const React = require('react');
const connect = require('react-redux').connect;

const CopyBox = function({type = '', dataId, currentPersonId, dispatch}){
  const onChange = (event) => {
    const checked = event.target.checked;
    const actionType = checked ? `COPY_${type.toUpperCase()}` : `UNCOPY_${type.toUpperCase()}`;
    dispatch({
      type: actionType,
      dataId,
      personId: currentPersonId
    });
  };
  return (
    <input type="checkbox" className="copy-box" onChange={onChange} />
  );
};

module.exports = connect(state => {
  const { currentPersonId } = state;
  return {
    currentPersonId
  };
})(CopyBox);