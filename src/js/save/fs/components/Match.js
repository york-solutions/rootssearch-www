const React = require('react');
const connect = require('react-redux').connect;
const Vital = require('./Vital');

class Match extends React.Component {
  
  render(){
    const {match, dispatch, currentPersonIndex} = this.props,
          data = match.getContent().getGedcomX(),
          person = data.getPersonById(match.getId()),
          birth = person.getFact('http://gedcomx.org/Birth'),
          death = person.getFact('http://gedcomx.org/Death'),
          parents = data.getPersonsParents(person),
          father = parents.find(p => p.isMale()),
          mother = parents.find(p => p.isFemale()),
          spouse = data.getPersonsSpouses(person)[0],
          select = () => {
            dispatch({
              type: 'SELECT_MATCH',
              personIndex: currentPersonIndex,
              matchId: match.getId()
            });
          };
    return (
      <div className="match box">
        <div>
          <span className="person-name">{person.getDisplayName(true)}</span>
          <span className="person-id label">{person.getId()}</span>
        </div>
        {birth ? <Vital fact={birth} /> : null}
        {death ? <Vital fact={death} /> : null}
        <div className="relations">
          <Relation person={father} relationship="Father" />
          <Relation person={mother} relationship="Mother" />
          <Relation person={spouse} relationship="Spouse" />
        </div>
        <button className="btn btn-rs btn-lg" onClick={select}>Select</button>
      </div>
    );
  }
  
}

module.exports = connect(state => {
  return { currentPersonIndex: state.currentPersonIndex };
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