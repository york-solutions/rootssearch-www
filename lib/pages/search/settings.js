const React = require('react'),
      ReactDOM = require('react-dom'),
      store = require('./settings-store'),
      loaded = require('../loaded');

/**
 * Manage the display of the list of sites
 */
class SitesList extends React.Component {
  render() {
    let sites = this.props.sites.map(site => 
      <SearchSite site={site} key={site.id} />
    );
    return <div>{sites}</div>;
  }
}

class SearchSite extends React.Component {
  constructor(props){
    super(props);
    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
  }
  render(){
    return <div className="site row">
      <div className="site-description col-md-10">
        <div className="site-name">{this.props.site.name}</div>
        <p className="text-muted">{this.props.site.description.en}</p>
      </div>
      <div className="site-settings-col col-md-2">
        <div className="btn-group btn-toggle" data-toggle="buttons">
          <label className={"btn btn-rs enabled-btn " + (this.props.site.enabled ? 'active' : '')}>
            <input type="radio" name="enabled" autoComplete="off" value="enabled" onClick={this.enable} /> Enabled
          </label>
          <label className={"btn btn-rs disabled-btn " + (!this.props.site.enabled ? 'active' : '')}>
            <input type="radio" name="enabled" autoComplete="off" value="disabled" onClick={this.disable} /> Disabled
          </label>
        </div>
      </div>
      <div className="col-xs-12"><hr /></div>
    </div>;
  }
  enable(){
    store.dispatch({
      type: 'ENABLE_SITE',
      site: this.props.site.id
    });
  }
  disable(){
    store.dispatch({
      type: 'DISABLE_SITE',
      site: this.props.site.id
    });
  }
}

function render(){
  return ReactDOM.render(
    <SitesList sites={store.getState().sites} />, 
    document.getElementById('sites-list')
  );
}

store.subscribe(render);
render();
loaded();