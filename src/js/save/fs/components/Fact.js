/**
 * Display a vital fact.
 */

const React = require('react');
const CopyBox = require('./CopyBox');

const Fact = function({fact, copyable = false, onDateCopyChange=()=>{}, onPlaceCopyChange=()=>{} }){
    
  if(!fact){
    return null;
  }
  
  const factId = fact.getId();
  
  return (
    <div className="fact">
      <span className="label">{fact.getTypeDisplayLabel()}</span>
      <div className="fact-line">
        {copyable && fact.getDateDisplayString() && <CopyBox dataId={factId} onChange={onDateCopyChange} />}
        <div className="fact-piece">{fact.getDateDisplayString()}</div>
      </div>
      <div className="fact-line">
        {copyable && fact.getPlaceDisplayString() && <CopyBox dataId={factId} onChange={onPlaceCopyChange} />}
        <div className="fact-piece">{fact.getPlaceDisplayString()}</div>
      </div>
    </div>
  );
};
  

module.exports = Fact;