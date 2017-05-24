const React = require('react');
const FS = require('../utils/fs');

class PersonBoxTitle extends React.Component {
  
  constructor(props){
    super(props);
    this.personUrl = this.personUrl.bind(this);
  }
  
  render(){
    const {person, displayId = true} = this.props;
    return (
      <div>
        <span className="person-name large">{person.getDisplayName(true)}</span>
        {displayId && <a className="person-id label" href={this.personUrl()} target="_blank">{person.getId()}</a>}
        <br />
        <span className="life-span">{person.getLifespan(true)}</span>
      </div>  
    );
  }
  
  personUrl(){
    const domain = FS.platformHost(),
          personId = this.props.person.getId();
    return `${domain}/platform/redirect?person=${personId}`;
  }
}

module.exports = PersonBoxTitle;