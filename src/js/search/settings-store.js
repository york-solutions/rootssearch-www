const Redux = require('redux'),
      gensites = require('gensites'),
      Settings = require('./settings-manager'),
      settingsReducer = require('./settings-reducer');

/**
 * Load the current list of enabled sites from storage and use that to set
 * the enabled property on the full list of available sites.
 * 
 * @returns {Sites[]} full list of available sites
 */
function loadSiteSettings(){
  Settings.load();
  const sites = gensites.sites(),
      enabledSites = Settings.get('sites');
  sites.forEach(site => {
    site.enabled = enabledSites.indexOf(site.id) !== -1;
  });
  return sites;
}

/**
 * Persists the current list of enabled sites.
 */
function saveSiteSettings(sites){
  Settings.set('sites', sites.filter(site => site.enabled).map(site => site.id));
  Settings.save();
}

// Initialize the store with site settings loaded from cookies
const store = Redux.createStore(settingsReducer, { 
  sites: loadSiteSettings()
});

// Whenever the settings change, recompute the list of enabled sites
store.subscribe(() => {
  saveSiteSettings(store.getState().sites);
});

module.exports = store;