/**
 * Return an object representing a clean initial selected match state.
 */
module.exports = function(){
  return {
    matchId: null,
    gedcomx: null,
    loading: false,
    saving: false,
    saved: false,
    
    // Map of record person fact IDs to match person facts
    factMap: {},

    copyName: false,
    
    // copied maps are keyed by record fact ID; values are boolean
    copiedDates: {},
    copiedPlaces: {},
    
    // values are a map of {NamePartType => value}
    overrideName: {},
    
    // override maps are keyed by match conclusion ID; are the new input value
    overrideDates: {}, // values are the new input value
    overridePlaces: {}, // values are the new input value
    
    // map of {match factId => reason statement}
    factReasons: {},
    
    // reason statement
    nameReason: '',
  };
};