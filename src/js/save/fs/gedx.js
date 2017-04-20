/**
 * Misc GEDCOM X utilities
 */
module.exports = {
  
  /**
   * Load the GEDCOM X data
   */
  load: function(){
    let data;
    
    // gedxData is supposed to be included on the page but to be safe we're going make sure it's there
    if(typeof gedxData !== 'undefined'){
      data = gedxData;
    } else {
      data = {};
    }
    
    return data;
  },
  
  /**
   * Massage the GEDCOM X data so that
   * - all persons have IDs (the only case where persons could have no ID is when
   *   they aren't part of a relationship; don't need an ID if nothing references you)
   */
  massage: function (data){
    
    // Make sure we have a persons array
    if(!Array.isArray(data.persons)){
      data.persons = [];
    }
    
    // Make sure all persons have IDs. Get a list of existing IDs to make sure
    // any of our generated IDs don't conflict with existing IDs.
    let ids = data.persons.filter(p => p.id !== undefined).map(p => p.id),
        id = 0;
    data.persons.forEach(p => {
      
      // If a person doesn't have an ID...
      if(!p.id){
        
        // Loop until we find an ID that's not being used
        while(ids.indexOf(++id) !== -1){ }
        
        // Set and increment the ID
        p.id = id;
      }
    });
    
    return data;
  }
  
};