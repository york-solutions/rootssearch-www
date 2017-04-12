var Settings = require('./settings-manager'),
    gensites = require('gensites'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    Redux = require('redux');

/**
 * Manage the display of the list of sites
 */
class SitesList extends React.Component {
  render() {
    let sites = this.props.sites.map(site => 
      <SearchSite site={site} key={site.id} enableSite={this.props.enableSite} disableSite={this.props.disableSite} />
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
    this.props.enableSite(this.props.site.id);
  }
  disable(){
    this.props.disableSite(this.props.site.id);
  }
}

function settingsReducer(state, action) {
  return {
    sites: sitesReducer(state.sites, action)
  };
}

function sitesReducer(sitesState = [], action){
  let enable = true;
  switch(action.type){
    // Toggle site. Take advantage of switch statement fallthrough
    // to reuse code for toggling a site.
    case 'DISABLE_SITE':
      enable = false;
    case 'ENABLE_SITE':
      return sitesState.map(site => {
        return Object.assign({}, site, {
          enabled: site.id === action.site ? enable : site.enabled
        });
      });
    default:
      return sitesState;
  }
}

function loadSiteSettings(){
  Settings.load();
  const sites = gensites.sites(),
      enabledSites = Settings.get('sites');
  sites.forEach(site => {
    site.enabled = enabledSites.indexOf(site.id) !== -1;
  });
  return sites;
}

function saveSiteSettings(sites){
  Settings.set('sites', sites.filter(site => site.enabled).map(site => site.id));
  Settings.save();
}

function init(){
  const store = Redux.createStore(settingsReducer, { 
    sites: loadSiteSettings()
  });
  const render = () => ReactDOM.render(
    <SitesList 
      sites={store.getState().sites} 
      enableSite={(siteId) => {
        console.log('enable site', siteId);
        store.dispatch({
          type: 'ENABLE_SITE',
          site: siteId
        });
      }} 
      disableSite={(siteId) => {
        console.log('disable site', siteId);
        store.dispatch({
          type: 'DISABLE_SITE',
          site: siteId
        });
      }} />, 
    document.getElementById('sites-list')
  );
  store.subscribe(render);
  store.subscribe(() => {
    saveSiteSettings(store.getState().sites);
  });
  render();
}

document.addEventListener("DOMContentLoaded", init);