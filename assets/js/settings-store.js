const Redux = require('redux'),
      gensites = require('gensites'),
      Settings = require('./settings-manager');

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

const store = Redux.createStore(settingsReducer, { 
  sites: loadSiteSettings()
});
store.subscribe(() => {
  saveSiteSettings(store.getState().sites);
});

module.exports = store;