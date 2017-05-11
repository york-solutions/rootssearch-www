/**
 * Given a name, return a map of {NamePartType => value} for the first name form.
 * 
 * @param {GedcomX.Name}
 * @returns {NamePartType => value}
 */
module.exports = (name) => {
  return name.getNameForms()[0].getParts().reduce((accumulator, part) => {
    // TODO: handle multiple parts of the same type
    accumulator[part.getType()] = part.getValue();
    return accumulator;
  }, {});
};