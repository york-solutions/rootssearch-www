/**
 * Modal that shows a listed of pending updates and a place to enter the reason
 * for reach change.
 */

const React = require('react');
const connect = require('react-redux').connect;
const ModalWrapper = require('./ModalWrapper');
const GedcomX = require('../../utils/gedcomx');
const Name = require('../Name');
const Fact = require('../Fact');
const Reason = require('../Reason');

const saveMatchAction = require('../../actions/saveMatch');

const selectedMatchSelector = require('../../selectors/selectedMatch');
const nameModifiedSelector = require('../../selectors/nameModified');
const updatedNamePartsSelector = require('../../selectors/updatedNameParts');
const updatedMatchFactsSelector = require('../../selectors/updatedMatchFacts');

class ReviewUpdatesModal extends React.Component {
  
  render(){
    const {nameModified, name, nameReason, facts, factReasons} = this.props;
    return (
      <ModalWrapper title="Review The Changes">
        <div className="review-updates-modal">
          {nameModified && (
            <div>
              <div className="row">
                <div className="col-md-6"><Name name={name} /></div>
                <div className="col-md-6"><Reason reason={nameReason} onChange={this.nameReasonChangeHandler.bind(this)} /></div>
              </div>
              <hr />
            </div>
          )}
          {facts.map(({fact}) => {
            const factId = fact.getId();
            return (
              <div key={factId}>
                <div className="row" >
                  <div className="col-md-6"><Fact fact={fact} /></div>
                  <div className="col-md-6"><Reason reason={factReasons[factId]} onChange={this.factReasonChangeHandler(factId).bind(this)} /></div>
                </div>
                <hr />
              </div>
            );
          })}
          <div className="toolbar">
            <button className="btn btn-orange btn-lg" onClick={this.saveUpdates.bind(this)}>Save</button>
            <a href onClick={this.cancelReview.bind(this)} >Cancel</a>
          </div>
        </div>
      </ModalWrapper>
    );
  }
  
  nameReasonChangeHandler(event) {
    this.props.dispatch({
      type: 'NAME_REASON',
      value: event.target.value
    });
  }
  
  factReasonChangeHandler(factId){
    return (event) => {
      this.props.dispatch({
        type: 'FACT_REASON',
        value: event.target.value,
        dataId: factId,
        personId: this.props.personId
      });
    };
  }
  
  saveUpdates() {
    this.props.dispatch(saveMatchAction());
  }
  
  cancelReview(e) {
    this.props.dispatch({
      type: 'CANCEL_REVIEW'
    });
    e.preventDefault(); 
    return false;
  }
}

const mapStateToProps = state => {
  const match = selectedMatchSelector(state),
        nameParts = updatedNamePartsSelector(state);
  return {
    name: nameParts ? GedcomX.Name.fromParts(nameParts) : null,
    nameReason: match.nameReason,
    nameModified: nameModifiedSelector(state),
    facts: updatedMatchFactsSelector(state).filter(fact => fact.display && fact.modified),
    factReasons: match.factReasons
  };
};

module.exports = connect(mapStateToProps)(ReviewUpdatesModal);