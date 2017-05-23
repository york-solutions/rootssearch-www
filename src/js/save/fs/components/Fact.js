/**
 * Display a vital fact.
 */

const React = require('react');
const CopyBox = require('./CopyBox');

const Fact = function({fact, placeCopied=false, dateCopied=false, copyable=false, onDateCopyChange=()=>{}, onPlaceCopyChange=()=>{} }){
    
  if(!fact){
    return null;
  }
  
  const factId = fact.getId();
  
  return (
    <div className="fact conclusion">
      <span className="label">{fact.getTypeDisplayLabel()}</span>
      <div className="fact-line conclusion-line">
        {copyable && fact.getDateDisplayString() && <CopyBox dataId={factId} onChange={onDateCopyChange} copied={dateCopied} />}
        <div className="fact-piece">{fact.getDateDisplayString()}</div>
      </div>
      <div className="fact-line conclusion-line">
        {copyable && fact.getPlaceDisplayString() && <CopyBox dataId={factId} onChange={onPlaceCopyChange} copied={placeCopied} />}
        <div className="fact-piece">{fact.getPlaceDisplayString()}</div>
      </div>
    </div>
  );
};
  

module.exports = Fact;