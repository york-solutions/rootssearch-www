/**
 * RecordPerson displays a person from the POSTed GEDCOM X record data.
 */

const React = require('react');
const connect = require('react-redux').connect;
const PersonBoxTitle = require('./PersonBoxTitle');
const Fact = require('./Fact');
const Name = require('./Name');
const Family = require('./Family');
const matchedSelector = require('../selectors/matched');
const savedSelector = require('../selectors/saved');
const currentPersonSelector = require('../selectors/currentPerson');

class RecordPerson extends React.Component {
  
  constructor(props){
    super(props);
    this.onDateCopyChange = this.onCopyChange('date').bind(this);
    this.onPlaceCopyChange = this.onCopyChange('place').bind(this);
    this.onNameCopyChange = this.onCopyChange('name').bind(this);
  }
  
  render(){
    const { person, record, matched = false, saved = false, factOrder, facts, nameCopied, copiedDates, copiedPlaces } = this.props,
          copyable = matched && !saved;
    return (
      <div>
        <div className={'person record' + (matched ? ' matched' : '') + (saved ? ' saved' : '')}>
          <div className="label">Record Person</div>
          <div className="box">
            <PersonBoxTitle person={person} displayId={false} />
            <div className="box-body">
              <Name 
                name={person.getPreferredName()} 
                copied={nameCopied} 
                copyable={copyable} 
                onCopyChange={this.onNameCopyChange} />
              {factOrder.map(id => {
                return (
                  <div key={id}>
                    <hr />
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
            </div>
          </div>
        </div>
        <Family gedcomx={record} personId={person.getId()} />
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
    copiedPlaces: match.copiedPlaces
  };
};

module.exports = connect(mapStateToProps)(RecordPerson);