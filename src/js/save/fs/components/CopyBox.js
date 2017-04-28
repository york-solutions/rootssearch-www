const React = require('react');
const connect = require('react-redux').connect;

const CopyBox = function({type = '', dataId, currentPersonIndex, dispatch}){
  const onChange = (event) => {
    const checked = event.target.checked;
    const actionType = checked ? `COPY_${type.toUpperCase()}` : `UNCOPY_${type.toUpperCase()}`;
    dispatch({
      type: actionType,
      nameId: dataId,
      personIndex: currentPersonIndex
    });
  };
  return (
    <input type="checkbox" className="copy-box" onChange={onChange} />
  );
};

module.exports = connect(state => {
  const { currentPersonIndex } = state;
  return {
    currentPersonIndex
  };
})(CopyBox);