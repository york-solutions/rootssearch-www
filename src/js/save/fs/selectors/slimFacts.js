/**
 * Given a GedcomX record person, this will slim down the list of facts by
 * ensuring there is only one fact per vital (Birth, Christening, Death, Burial).
 * The first vital is kept; all others are discarded.
 * 
 * @param {GedcomX.Person} person
 */
module.exports = function(person){
  let birth = false,
      christening = false,
      death = false,
      burial = false;
  return person.getFacts().filter(f => {
    switch(f.getType()){
      case 'http://gedcomx.org/Birth':
        if(birth){
          return false;
        } else {
          birth = true;
          return true;
        }
      case 'http://gedcomx.org/Christening':
        if(christening){
          return false;
        } else {
          christening = true;
          return true;
        }
      case 'http://gedcomx.org/Death':
        if(death){
          return false;
        } else {
          death = true;
          return true;
        }
      case 'http://gedcomx.org/Burial':
        if(burial){
          return false;
        } else {
          burial = true;
          return true;
        }
      default:
        return true;
    }
  });
};