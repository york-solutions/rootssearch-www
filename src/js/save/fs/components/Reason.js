/**
 * Display the text field for a reason statement.
 */

const React = require('react');

const Reason = function({reason = '', onChange}){
  return (
    <div className="reason">
      <div>Why is this change correct?</div>
      <div><textarea rows="2" value={reason} onChange={onChange} /></div>
    </div>
  );
};

module.exports = Reason;