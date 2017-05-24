const React = require('react');
const connect = require('react-redux').connect;
const BoxTitle = require('./BoxTitle');
const Fact = require('./Fact');
const Name = require('./Name');
const Family = require('./Family');
const MatchesList = require('./MatchesList');
const SelectedMatch = require('./SelectedMatch');

const matchedSelector = require('../selectors/matched');
const savedSelector = require('../selectors/saved');
const currentPersonSelector = require('../selectors/currentPerson');
const sourceDescriptionSelector = require('../selectors/sourceDescription');

class MatchesContainer extends React.Component {
  
  constructor(props){
    super(props);
    this.onDateCopyChange = this.onCopyChange('date').bind(this);
    this.onPlaceCopyChange = this.onCopyChange('place').bind(this);
    this.onNameCopyChange = this.onCopyChange('name').bind(this);
  }
  
  render(){
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
        sourceDescription
      } = this.props,
      copyable = matched && !saved;
      
    return (
      <div className="matches-grid">
      
        {/* Begin left column (record person) */}
        <div className="label">Record Person</div>
        <BoxTitle>
          <div className="person-name large">{person.getDisplayName(true)}</div>
          <div className="record-title">{sourceDescription.getTitles()[0].getValue()}</div>
        </BoxTitle>
        <div className="box-row">
          <Name 
            name={person.getPreferredName()} 
            copied={nameCopied} 
            copyable={copyable} 
            onCopyChange={this.onNameCopyChange} />
        </div>
        {factOrder.map(id => {
          return (
            <div className="box-row" key={id}>
              <Fact
                fact={facts[id]} 
                copyable={copyable}
                dateCopied={!!copiedDates[id]}
                placeCopied={!!copiedPlaces[id]}
                onDateCopyChange={this.onDateCopyChange} 
                onPlaceCopyChange={this.onPlaceCopyChange} />
            </div>
          );
        })}
        <div className="box-end"></div>
        <Family gedcomx={record} personId={person.getId()} />
        {/* End left column */}
        
        {/* Begin right column (matches) */}
        { matched ? <SelectedMatch /> : <MatchesList /> }
        {/* End right column (matches) */}
        
      </div>
    );
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
        match = currentPerson.selectedMatch;
  return {
    record: state.record,
    person: currentPerson.gedcomx,
    personId: state.currentPersonId,
    matched: matchedSelector(state),
    saved: savedSelector(state),
    facts: currentPerson.facts,
    factOrder: currentPerson.factOrder,
    nameCopied: match.copyName,
    copiedDates: match.copiedDates,
    copiedPlaces: match.copiedPlaces,
    sourceDescription: sourceDescriptionSelector(state)
  };
};

module.exports = connect(mapStateToProps)(MatchesContainer);
