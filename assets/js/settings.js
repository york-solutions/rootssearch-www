var Settings = require('./settings-manager'),
    gensites = require('gensites'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    Redux = require('redux'),
    $ = require('jquery');

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

document.addEventListener("DOMContentLoaded", function(){
  Settings.load();
  const sites = gensites.sites(),
      enabledSites = Settings.get('sites');
  sites.forEach(site => {
    site.enabled = enabledSites.indexOf(site.id) !== -1;
  });
  
  const store = Redux.createStore((state = [], action) => {
    switch(action.type){
      case 'ENABLE_SITE':
      case 'DISABLE_SITE':
      default:
        return state;
    }
  }, sites);
  
  const enableSite = (siteId) => {
    console.log('enable site', siteId);
    store.dispatch({
      type: 'ENABLE_SITE',
      site: siteId
    });
  };
  const disableSite = (siteId) => {
    console.log('disable site', siteId);
    store.dispatch({
      type: 'DISABLE_SITE',
      site: siteId
    });
  };
  
  const render = () => ReactDOM.render(
    <SitesList sites={store.getState()} enableSite={enableSite} disableSite={disableSite} />, 
    document.getElementById('sites-list')
  );
  
  store.subscribe(render);
  render();
});

/**
 * Manage a site's display and settings
 */
 /*
var SearchSite = function(site, enabled){
  this.site = site;
  this.enabled = enabled;
  this.changeFunc = function(){};
};

SearchSite.prototype.render = function(){
  var self = this;
  self.$dom = $(`<div class="site row">
    <div class="site-description col-md-10">
      <div class="site-name">${this.site.name}</div>
      <p class="text-muted">${this.site.description.en}</p>
    </div>
    <div class="site-settings-col col-md-2">
      <div class="btn-group btn-toggle" data-toggle="buttons">
        <label class="btn btn-rs enabled-btn">
          <input type="radio" name="enabled" autocomplete="off" value="enabled"> Enabled
        </label>
        <label class="btn btn-rs disabled-btn">
          <input type="radio" name="enabled" autocomplete="off" value="disabled"> Disabled
        </label>
      </div>
    </div>
    <div class="col-xs-12"><hr></div>
  </div>`);
  self.updateButtonStates();
  self.$dom.find('.enabled-btn').click(function(){
    self.enable();
  });
  self.$dom.find('.disabled-btn').click(function(){
    self.disable();
  });
  return this;
};

SearchSite.prototype.getDOM = function(){
  return this.$dom;
};

SearchSite.prototype.isEnabled = function(){
  return this.enabled;
};

SearchSite.prototype.disable = function(){
  if(this.enabled){
    this.enabled = false;
    this.changed();
    ga('send', 'event', 'settings', 'disableSite', this.site.id);
  }
  return this;
};

SearchSite.prototype.enable = function(){
  if(!this.enabled){
    this.enabled = true;
    this.changed();
    ga('send', 'event', 'settings', 'enableSite', this.site.id);
  }
  return this;
};

SearchSite.prototype.updateButtonStates = function(){
  if(this.enabled){
    this.$dom.find('.enabled-btn').addClass('active');
    this.$dom.find('.disabled-btn').removeClass('active');
  } else {
    this.$dom.find('.disabled-btn').addClass('active');
    this.$dom.find('.enabled-btn').removeClass('active');
  }
};

SearchSite.prototype.changed = function(){
  var self = this;
  self.updateButtonStates();
  setTimeout(function(){
    self.changeFunc();
  });
};

SearchSite.prototype.onChange = function(func){
  this.changeFunc = func;
};
*/