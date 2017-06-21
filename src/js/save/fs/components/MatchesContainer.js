const React = require('react');
const connect = require('react-redux').connect;
const Fact = require('./Fact');
const Name = require('./Name');
const Family = require('./Family');
const MatchesList = require('./MatchesList');
const PersonBoxTitle = require('./PersonBoxTitle');
const EditableFact = require('./EditableFact');
const EditableName = require('./EditableName');

const matchedSelector = require('../selectors/matched');
const savedSelector = require('../selectors/saved');
const currentPersonSelector = require('../selectors/currentPerson');
const updatedNamePartsSelector = require('../selectors/updatedNameParts');
const matchFactsSelector = require('../selectors/updatedMatchFacts');
const nameModifiedSelector = require('../selectors/nameModified');

class MatchesContainer extends React.Component {
  
  constructor(props){
    super(props);
    this.onDateCopyChange = this.onCopyChange('date').bind(this);
    this.onPlaceCopyChange = this.onCopyChange('place').bind(this);
    this.onNameCopyChange = this.onCopyChange('name').bind(this);
  }
  
  render(){
    const { matched = false, loadingMatch } = this.props;

    let rows = [
      ...this.renderRecordPerson()
    ];
    
    if(matched && !loadingMatch){
      rows.push(...this.renderSelectedMatch());
    } else {
      rows.push(<MatchesList />);
    }
  
    return (
      <div className="matches-grid">
        {rows}
      </div>
    );
  }
  
  renderRecordPerson(){
    const { 
        person, 
        record, 
        matched = false, 
        saved = false, 
        factOrder, 
        facts, 
        nameCopied, 
        copiedDates, 
        copiedPlaces, 
        recordTitle
      } = this.props,
      copyable = matched && !saved;
    return [
      <div className="label left">Record Person</div>,
      <div className="box-title left">
        <div className="person-name large">{person.getDisplayName(true)}</div>
        <div className="record-title">{recordTitle}</div>
      </div>,
      <div className="box-row left">
        <Name 
          name={person.getPreferredName()} 
          copied={nameCopied} 
          copyable={copyable} 
          onCopyChange={this.onNameCopyChange} />
      </div>,
      ...(factOrder.map(id => {
        return (
          <div className="box-row left">
            <Fact
              fact={facts[id]} 
              copyable={copyable}
              dateCopied={!!copiedDates[id]}
              placeCopied={!!copiedPlaces[id]}
              onDateCopyChange={this.onDateCopyChange} 
              onPlaceCopyChange={this.onPlaceCopyChange} />
          </div>
        );
      })),
      <div className="box-end left"></div>,
      <div className="left" />, // spacer that lines up with the button toolbar on the right
      <div className="left">
        <Family className="left" gedcomx={record} personId={person.getId()} />
      </div>
    ];
  }
  
  renderSelectedMatch(){
    const {
      matchPerson,
      saved,
      nameParts,
      nameReason,
      nameModified,
      matchFacts,
      dispatch,
      matchId,
      gedcomx
    } = this.props;
    return [
      <div className="label right">Tree Person</div>,
      <div className="box-title right"><PersonBoxTitle person={matchPerson} /></div>,
      <div className="box-row right">{
        saved ? 
          <Name name={matchPerson.getPreferredName()} /> :
          <EditableName   
            nameParts={nameParts} 
            attribution={matchPerson.getPreferredName().getAttribution()}
            reason={nameReason}
            modified={nameModified}
            onChange={this.nameChangeHandler.bind(this)} />
      }</div>,
      ...matchFacts.map(({fact, display, modified, originalAttribution}) => {
        return (
          <div className="box-row right">
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
      }),
      <div className="box-end right"></div>,
      <div className="right toolbar">{saved ? 
        <button className="btn btn-lg disabled" disabled>Saved</button> :
        [
          <button className="btn btn-orange btn-lg" onClick={() => dispatch({ type: 'REVIEW_UPDATES' })}>Save</button>,
          <a href onClick={this.cancelMatch.bind(this)}>Cancel</a>
        ]
      }</div>,
      <div className="right"><Family gedcomx={gedcomx} personId={matchId} /></div>
    ];
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
  
  onCopyChange(type){
    type = type.toUpperCase();
    return (change) => {
      this.props.dispatch({
        type: change.copy ? `COPY_${type}` : `UNCOPY_${type}`,
        dataId: change.dataId,
        personId: this.props.personId
      });
    };
  }
  
}

const mapStateToProps = state => {
  const currentPerson = currentPersonSelector(state),
        match = currentPerson.selectedMatch,
        {matchId, gedcomx, copyName, nameReason, loading} = match;
  return {
    record: state.record,
    person: currentPerson.gedcomx,
    personId: state.currentPersonId,
    matched: matchedSelector(state),
    loadingMatch: loading,
    saved: savedSelector(state),
    facts: currentPerson.facts,
    factOrder: currentPerson.factOrder,
    nameCopied: match.copyName,
    copiedDates: match.copiedDates,
    copiedPlaces: match.copiedPlaces,
    recordTitle: state.record.getRootSourceDescription().getTitles()[0].getValue(),
    matchId,
    matchPerson: gedcomx ? gedcomx.getPersonById(matchId) : null,
    gedcomx,
    copyName,
    nameReason,
    nameModified: nameModifiedSelector(state),
    nameParts: updatedNamePartsSelector(state),
    matchFacts: matchFactsSelector(state)
  };
};

module.exports = connect(mapStateToProps)(MatchesContainer);
