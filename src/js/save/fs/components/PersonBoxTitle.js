const React = require('react');
const FS = require('../utils/fs');
const BoxTitle = require('./BoxTitle');

class PersonBoxTitle extends React.Component {
  
  constructor(props){
    super(props);
    this.personUrl = this.personUrl.bind(this);
  }
  
  render(){
    const {person, displayId = true} = this.props;
    return (
      <BoxTitle>
        <span className="person-name large">{person.getDisplayName(true)}</span>
        {displayId && <a className="person-id label" href={this.personUrl()} target="_blank">{person.getId()}</a>}
        <br />
        <span className="life-span">{person.getLifespan(true)}</span>
      </BoxTitle>  
    );
  }
  
  personUrl(){
    const domain = FS.platformHost(),
          personId = this.props.person.getId();
    return `${domain}/platform/redirect?person=${personId}`;
  }
}

module.exports = PersonBoxTitle;