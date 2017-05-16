/**
 * SelectedMatch displays the selected match.
 */

const React = require('react');
const connect = require('react-redux').connect;
const Fact = require('./Fact');
const EditableFact = require('./EditableFact');
const Name = require('./Name');
const EditableName = require('./EditableName');
const Family = require('./Family');
const saveMatchAction = require('../actions/saveMatch');
const savedSelector = require('../selectors/saved');
const updatedNamePartsSelector = require('../selectors/updatedNameParts');
const matchFactsSelector = require('../selectors/displayedMatchFacts');

class SelectedMatch extends React.Component {

  render(){
    return (
      <div>
        <div className="person">
          <div className="label">Tree Person</div>
          <div className="box">
            { this.props.saved ? 
              <Name name={this.props.matchPerson.getPreferredName()} /> :
              <EditableName nameParts={this.props.nameParts} onChange={this.nameChangeHandler.bind(this)} />
            }
            {this.props.matchFacts.map(({fact, display}) => {
              return (
                <div key={fact.getId()}>
                  <hr />
                  { this.props.saved ?
                    <Fact fact={fact} /> :
                    (display ?
                      <EditableFact 
                        fact={fact} 
                        onDateChange={this.dateChangeHandler(fact.getId()).bind(this)} 
                        onPlaceChange={this.placeChangeHandler(fact.getId()).bind(this)} /> :
                      <div className="fact-placeholder" />
                    )
                  }
                </div>
              );
            })}
            <hr />
            { this.props.saved ? 
              <button className="btn btn-lg disabled" disabled>Saved</button> :
              (
                <div className="toolbar">
                  <button className="btn btn-rs btn-lg" onClick={() => this.props.dispatch(saveMatchAction(this.props.personId))}>Save</button>
                  <a href onClick={this.cancelMatch.bind(this)}>Cancel</a>
                </div>
              )
            }
          </div>
        </div>
        <Family gedcomx={this.props.gedcomx} personId={this.props.matchId} />
      </div>
    );
  }
  
  nameChangeHandler(type){
    return (event) => {
      this.props.dispatch({
        type: 'OVERRIDE_NAMEPART',
        value: event.target.value,
        partType: type,
        personId: this.props.personId
      });
    };
  }
  
  dateChangeHandler(factId){
    return (date) => {
      this.props.dispatch({
        type: 'OVERRIDE_DATE',
        value: date,
        dataId: factId,
        personId: this.props.personId
      });
    };
  }
  
  placeChangeHandler(factId){
    return (place) => {
      this.props.dispatch({
        type: 'OVERRIDE_PLACE',
        value: place,
        dataId: factId,
        personId: this.props.personId
      });
    };
  }
  
  cancelMatch(e) {
    this.props.dispatch({
      type: 'CANCEL_MATCH',
      personId: this.props.personId
    });
    e.preventDefault(); 
    return false; 
  }
}

const mapStateToProps = state => {
  const {selectedMatches, currentPerson} = state,
        match = selectedMatches[currentPerson],
        {matchId, gedcomx, copyName} = match;
  return {
    matchId,
    matchPerson: gedcomx.getPersonById(matchId),
    gedcomx,
    personId: currentPerson,
    saved: savedSelector(state),
    copyName,
    nameParts: updatedNamePartsSelector(state),
    matchFacts: matchFactsSelector(state)
  };
};

module.exports = connect(mapStateToProps)(SelectedMatch);