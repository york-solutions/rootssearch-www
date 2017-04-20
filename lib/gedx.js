let GedcomX = require('gedcomx-js');
let debug = require('debug')('rootssearch:lib:gedx');

GedcomX.enableRsExtensions();
GedcomX.enableRecordsExtensions();

/**
 * Convert a GedcomX JSON object to gensearch v1 schema.
 * 
 * @param {Object} gedx GedcomX JSON object
 * @return {Object} gensearch v1 schema
 */
function convertToGensearch(gedx){
  let data = {};
  
  gedx = new GedcomX(gedx);
  
  // Calculate the principal person. genscrape will set the `principal` flag on
  // persons so we check for that. If it's not found then we just take the first
  // person.
  let person = gedx.getPrincipalPerson();
  if(!person){
    person = gedx.getPersons()[0];
  }
  
  // Can't continue unless we have a person
  if(person){
    
    debug('principal person');
    
    // Name
    let nameParts = person.getGivenAndSurname();
    data.givenName = nameParts.givenName;
    data.familyName = nameParts.familyName;
    
    // Birth
    let birth = person.getFactsByType('http://gedcomx.org/Birth')[0];
    if(birth){
      data.birthDate = birth.getDateValue();
      data.birthPlace = birth.getPlaceValue();
    }
    
    // Death
    let death = person.getFactsByType('http://gedcomx.org/Death')[0];
    if(death){
      data.deathDate = death.getDateValue();
      data.deathPlace = death.getPlaceValue();
    }
    
    // Calculate the principal person's relationships
    let parents = gedx.getPersonsParents(person),
        mother = parents.filter(p => p.isFemale())[0],
        father = parents.filter(p => p.isMale())[0];
    
    // Mother
    if(mother){
      let motherNameParts = mother.getGivenAndSurname();
      data.motherGivenName = motherNameParts.givenName;
      data.motherFamilyName = motherNameParts.familyName;
    }
    
    // Father
    if(father){
      let fatherNameParts = father.getGivenAndSurname();
      data.fatherGivenName = fatherNameParts.givenName;
      data.fatherFamilyName = fatherNameParts.familyName;
    }
    
    // Spouse and marriage
    let marriageRel = gedx.getPersonsCoupleRelationships(person)[0];
    if(marriageRel){
      
      let spouse = gedx.getPersonById(marriageRel.getOtherPerson(person).getResource().substring(1));
      if(spouse){
        let spouseNameParts = spouse.getGivenAndSurname();
        data.spouseGivenName = spouseNameParts.givenName;
        data.spouseFamilyName = spouseNameParts.familyName;
      }
      
      let marriage = marriageRel.getFacts().filter(f => f.getType() === 'http://gedcomx.org/Marriage')[0];
      if(marriage){
        data.marriagePlace = marriage.getPlaceValue();
        data.marriageDate = marriage.getDateValue();
      }
    }
    
  } else {
    debug('no principal person');
  }
  
  return data;
}

module.exports = {
  convertToGensearch: convertToGensearch
};

/******
 * Here we add custom extensions to GedcomX JS. These methods are not added
 * to GedcomX JS because they are specific to RootsSearch.
 ******/
 
/**
 * Get a person's given and surname parts.
 * 
 * @return {{givenName: String, familyName: String}}
 */
GedcomX.Person.prototype.getGivenAndSurname = function(){
  let data = {};
  let name = this.getPreferredName();
  let nameForm;
  let parts;
  if(!name){
    name = this.getNames()[0];
  }
  if(name){
    nameForm = name.getNameForms()[0];
  }
  if(nameForm){
    parts = nameForm.getNamePartsMap();
    data.givenName = parts['http://gedcomx.org/Given'];
    data.familyName = parts['http://gedcomx.org/Surname'];
  }
  return data;
};

/**
 * Get a map of name part values.
 * 
 * @return {{http://gedcomx.org/Prefix: String, http://gedcomx.org/Given: String, http://gedcomx.org/Surname: String, http://gedcomx.org/Suffix: String}}
 */
GedcomX.NameForm.prototype.getNamePartsMap = function(){
  let map = {};
  this.getParts().forEach(function(p){
    let type = p.getType();
    if(p.getValue()){
      if(map[type]){
        map[type] += ' ' + p.getValue();
      } else {
        map[type] = p.getValue();
      }
    }
  });
  return map;
};

/**
 * Get a value from a GedcomX date. Try formal first. Then try original.
 * 
 * @return {String} date
 */
GedcomX.Date.prototype.getValue = function(){
  return this.formal ? this.formal.replace(/^\+/,'') : this.original;
};

/**
 * Get the date value for a fact.
 * 
 * @return {String} date
 */
GedcomX.Fact.prototype.getDateValue = function(){
  if(this.date){
    return this.date.getValue();
  }
};

/**
 * Get the place value for a fact.
 * 
 * @return {String} place name
 */
GedcomX.Fact.prototype.getPlaceValue = function(){
  if(this.place){
    return this.place.getOriginal();
  }
};