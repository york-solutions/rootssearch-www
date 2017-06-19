const GedcomX = require('gedcomx-js');

/**
 * Calculate the full text string of a name.
 * 
 * @returns {String} full text
 */
GedcomX.Name.prototype.getFullText = function(){
  let fullText = '';
  let nameForm = this.getNameForms()[0];
  if(nameForm){
    fullText = nameForm.getFullText(true);
  }
  return fullText;
};

/**
 * Create a Name from a map of name parts.
 * 
 * @param {Object} nameParts {namePartType => value}
 * @returns {Name}
 */
GedcomX.Name.fromParts = function(nameParts){
  return GedcomX.Name({
    nameForms: [{
      parts: Object.keys(nameParts).map(type => {
        return {
          type: type,
          value: nameParts[type]
        };
      })
    }]
  });
};