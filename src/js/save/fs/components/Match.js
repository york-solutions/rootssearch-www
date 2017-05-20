const React = require('react');
const connect = require('react-redux').connect;
const Name = require('./Name');
const Fact = require('./Fact');
const PersonBoxTitle = require('./PersonBoxTitle');
const selectMatch = require('../actions/selectMatch');

class Match extends React.Component {
  
  render(){
    const {match, dispatch, currentPersonId} = this.props,
          data = match.getContent().getGedcomX(),
          person = data.getPersonById(match.getId()),
          birth = person.getFact('http://gedcomx.org/Birth'),
          death = person.getFact('http://gedcomx.org/Death'),
          parents = data.getPersonsParents(person),
          father = parents.find(p => p.isMale()),
          mother = parents.find(p => p.isFemale()),
          spouse = data.getPersonsSpouses(person)[0],
          select = () => {
            dispatch(selectMatch(currentPersonId, match.getId()));
          };
    return (
      <div className="match box">
        <PersonBoxTitle person={person} />
        <div className="box-body">
          <Name name={person.getPreferredName()} />
          {birth ? <Fact fact={birth} /> : null}
          {death ? <Fact fact={death} /> : null}
          <div className="relations">
            <Relation person={father} relationship="Father" />
            <Relation person={mother} relationship="Mother" />
            <Relation person={spouse} relationship="Spouse" />
          </div>
          <button className="btn btn-orange btn-lg" onClick={select}>Select</button>
        </div>
      </div>
    );
  }
  
}

module.exports = connect(state => {
  return { currentPersonId: state.currentPersonId };
})(Match);

function Relation({person, relationship}){
  if(!person) return null;
  return (
    <div className="relation">
      {relationship && <span className="label">{relationship}</span>}
      <div>{person.getDisplayName(true)}</div>
    </div>  
  );
}