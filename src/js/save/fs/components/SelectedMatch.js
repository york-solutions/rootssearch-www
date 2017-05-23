/**
 * SelectedMatch displays the selected match.
 */

const React = require('react');
const connect = require('react-redux').connect;
const PersonBoxTitle = require('./PersonBoxTitle');
const Fact = require('./Fact');
const EditableFact = require('./EditableFact');
const Name = require('./Name');
const EditableName = require('./EditableName');
const Family = require('./Family');
const savedSelector = require('../selectors/saved');
const updatedNamePartsSelector = require('../selectors/updatedNameParts');
const matchFactsSelector = require('../selectors/updatedMatchFacts');
const currentPersonSelector = require('../selectors/currentPerson');
const nameModifiedSelector = require('../selectors/nameModified');

class SelectedMatch extends React.Component {

  render(){
    return (
      <div>
        <div className="person matched">
          <div className="label">Tree Person</div>
          <div className="box">
            <PersonBoxTitle person={this.props.matchPerson} />
            <div className="box-body">
              { this.props.saved ? 
                <Name name={this.props.matchPerson.getPreferredName()} /> :
                <EditableName   
                  nameParts={this.props.nameParts} 
                  attribution={this.props.matchPerson.getPreferredName().getAttribution()}
                  reason={this.props.nameReason}
                  modified={this.props.nameModified}
                  onChange={this.nameChangeHandler.bind(this)} />
              }
              {this.props.matchFacts.map(({fact, display, modified, originalAttribution}) => {
                return (
                  <div key={fact.getId()}>
                    <hr />
                    { this.props.saved ?
                      <Fact fact={fact} /> :
                      (display ?
                        <EditableFact 
                          fact={fact}
                          modified={modified}
                          originalAttribution={originalAttribution}
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
                    <button className="btn btn-orange btn-lg" onClick={() => this.props.dispatch({ type: 'REVIEW_UPDATES' })}>Save</button>
                    <a href onClick={this.cancelMatch.bind(this)}>Cancel</a>
                  </div>
                )
              }
            </div>
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
  const currentPerson = currentPersonSelector(state),
        {selectedMatch} = currentPerson,
        {matchId, gedcomx, copyName, nameReason} = selectedMatch;
  return {
    matchId,
    matchPerson: gedcomx.getPersonById(matchId),
    gedcomx,
    personId: state.currentPersonId,
    saved: savedSelector(state),
    copyName,
    nameReason,
    nameModified: nameModifiedSelector(state),
    nameParts: updatedNamePartsSelector(state),
    matchFacts: matchFactsSelector(state)
  };
};

module.exports = connect(mapStateToProps)(SelectedMatch);