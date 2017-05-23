/**
 * Get the root source description for the GEDCOM X record
 */
module.exports = function(state){
  const gedcomx = state.record,
        aboutId = gedcomx.getDescription().replace('#', '');
  return gedcomx.getSourceDescriptions().find(sd => {
    return sd.getId() === aboutId;
  });
};