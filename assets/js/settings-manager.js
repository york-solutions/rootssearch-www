/**
 * Load, get, set, and save settings.
 */
var Settings = {
  _settings: {},
  _defaults: {
    sites: ['ancestry', 'familysearch', 'findmypast.co.uk', 'findagrave', 'google', 'myheritage']
  },
  load: function(){
    var cookie = cookies.getItem('settings'),
        parsed = {};
    if(cookie){
      try {
        parsed = JSON.parse(cookie);
      } catch(e){}
    }
    // TODO: updated to remove dependency on lodash. This won't scale well with
    // additional properties.
    this._settings.sites = parsed.sites || this._defaults.sites;
  },
  save: function(){
    cookies.setItem('settings', JSON.stringify(this._settings), Infinity);
  },
  get: function(key){
    return this._settings[key];
  },
  set: function(key, value){
    this._settings[key] = value;
  }
};