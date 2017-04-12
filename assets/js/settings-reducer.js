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

module.exports = settingsReducer;