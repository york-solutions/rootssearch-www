const GedcomX = require('gedcomx-js');

/**
 * Get a person's display name. Optionally calculate a display name if one
 * isn't set in the display properties.
 * 
 * @param {Boolean=} calculateIfMissing Calculate the display name if one isn't
 * set in the display properties.
 * @returns {String} display name
 */
GedcomX.Person.prototype.getDisplayName = function(calculateIfMissing){
  let displayName = '';
  
  if(this.getDisplay()){
    displayName = this.getDisplay().getName();
  }
  
  if(!displayName && calculateIfMissing){
    
    // Choose the preferred name or the first name
    let name = this.getPreferredName();
    
    // Calculate the name
    if(name){
      displayName = name.getFullText();
    }
  }
  
  return displayName;
};

/**
 * Get a person's lifespan. Calculate it when not available in the display properties
 * 
 * @param {Boolean=} calculateIfMissing Calculate the lifespan if one isn't
 * set in the display properties.
 * @return {String} lifespan
 */
GedcomX.Person.prototype.getLifespan = function(calculateIfMissing){
  if(this.getDisplay() && this.getDisplay().getLifespan()){
    return this.getDisplay().getLifespan();
  }
  let birth = this.getFactsByType('http://gedcomx.org/Birth')[0],
      christening = this.getFactsByType('http://gedcomx.org/Christening')[0],
      death = this.getFactsByType('http://gedcomx.org/Death')[0],
      burial = this.getFactsByType('http://gedcomx.org/Burial')[0],
      birthLike = birth || christening,
      deathLike = death || burial,
      birthYear = '', 
      deathYear = '';
  if(birthLike){
    let birthDate = birthLike.getDate();
    if(birthDate){
      birthYear = birthDate.getYear();
    }
  }
  if(deathLike){
    let deathDate = deathLike.getDate();
    if(deathDate){
      deathYear = deathDate.getYear();
    }
  }
  if(birthYear && deathYear){
    return `${birthYear} - ${deathYear}`;
  } else if(birthYear){
    return `born ${birthYear}`;
  } else if(deathYear){
    return `died ${deathYear}`;
  }
};

/**
 * Get the first fact of a given type, if one exists
 * 
 * @param {String} type
 * @returns {Fact}
 */
GedcomX.Person.prototype.getFact = function(type){
  return this.getFactsByType(type)[0];
};

/**
 * Get the fact matching the given ID
 * 
 * @param {String} id
 * @returns {Fact}
 */
GedcomX.Person.prototype.getFactById = function(id){
  return this.getFacts().find(f => f.getId() === id);
};

/**
 * Get the person's preferred name, or the first one if a preferred name doesn't exist.
 * 
 * @returns {Name}
 */
GedcomX.Person.prototype._getPreferredName = GedcomX.Person.prototype.getPreferredName;
GedcomX.Person.prototype.getPreferredName = function(){
  return this._getPreferredName() || this.getNames()[0];
};