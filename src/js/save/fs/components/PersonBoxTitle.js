const React = require('react');

class PersonBoxTitle extends React.Component {
  
  constructor(props){
    super(props);
    this.personUrl = this.personUrl.bind(this);
  }
  
  render(){
    const {person, displayId = true} = this.props;
    return (
      <div className="box-title">
        <span className="person-name large">{person.getDisplayName(true)}</span>
        {displayId && <a className="person-id label" href={this.personUrl()} target="_blank">{person.getId()}</a>}
        <br />
        <span className="life-span">{person.getLifespan(true)}</span>
      </div>  
    );
  }
  
  personUrl(){
    const domain = 'integration.familysearch.org',
          personId = this.props.person.getId();
    return `https://${domain}/platform/redirect?person=${personId}`;
  }
}

module.exports = PersonBoxTitle;