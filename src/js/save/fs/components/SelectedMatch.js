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

class SelectedMatch extends React.Component {

  render(){
    
    return (
      <div>
        <div className="person">
          <div className="label">Tree Person</div>
          <div className="box">
            { this.props.saved ? 
              <Name name={this.props.matchPerson.getPreferredName()} editable={true} /> :
              <EditableName nameParts={this.props.nameParts} onChange={this.nameChangeHandler.bind(this)} />
            }
            {this.props.factOrder.map(recordFactId => {
              let matchFact = this.props.factMap[recordFactId];
              return (
                <div key={recordFactId}>
                  <hr />
                  { this.props.saved ?
                    <Fact fact={matchFact} /> :
                    <EditableFact recordFactId={recordFactId} fact={matchFact} personId={this.props.personId} />
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
                  <a href onClick={(e) => {
                    // TODO: move this to a class method
                    this.props.dispatch({
                      type: 'CANCEL_MATCH',
                      personId: this.props.personId
                    });
                    e.preventDefault(); 
                    return false; 
                  }}>Cancel</a>
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
}

const mapStateToProps = state => {
  const {selectedMatches, currentPerson, factOrder} = state,
        match = selectedMatches[currentPerson],
        {matchId, gedcomx, factMap, copyName} = match;
  console.log(match, gedcomx);
  return {
    matchId,
    matchPerson: gedcomx.getPersonById(matchId),
    gedcomx,
    personId: currentPerson,
    factOrder: factOrder[currentPerson],
    factMap,
    saved: savedSelector(state),
    copyName,
    nameParts: updatedNamePartsSelector(state)
  };
};

module.exports = connect(mapStateToProps)(SelectedMatch);