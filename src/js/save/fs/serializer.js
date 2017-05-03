/**
 * Serialize options for redux-devtools-extension
 */
const GedcomX = require('gedcomx-js');
require('./gedx'); // Configures GedcomX extensions
 
module.exports = {
  replacer: (key, value) => {
    if(GedcomX.Root.isInstance(value)){
      return serialize(value, 'GedcomX.Root');
    }
    if(GedcomX.AtomEntry.isInstance(value)){
      return serialize(value, 'GedcomX.AtomEntry');
    }
    if(GedcomX.Person.isInstance(value)){
      return serialize(value, 'GedcomX.Person');
    }
    return value;
  },
  reviver: (key, value) => {
    if (typeof value === 'object' && value !== null && '__serializedType__'  in value) {
      const data = value.data;
      switch (value.__serializedType__) {
        case 'GedcomX.Root': return GedcomX(data);
        case 'GedcomX.AtomEntry': return GedcomX.AtomEntry(data);
        case 'GedcomX.Person': return GedcomX.Person(data);
        default: return data;
      }
    }
    return value;
  }
};

function serialize(object, type){
  return {
    data: object.toJSON(),
    __serializedType__: type
  };
}