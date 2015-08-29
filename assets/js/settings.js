$(function(){
  
  Settings.load();
  SearchSite.template = Handlebars.compile($('#sites-template').html());
  
  var availableSites = gensites.sites(),
      enabledSites = Settings.get('sites'),
      $sitesList = $('#sites-list');
  for(var i = 0; i < availableSites.length; i++){
    var gensite = availableSites[i],
        searchSite = new SearchSite(gensite);
    $sitesList.append(searchSite.getDOM());
    if(enabledSites.indexOf(gensite.id) !== -1){
      searchSite.enable();
    } else {
      searchSite.disable();
    }
  }
});

/**
 * Manage a site's display and settings
 */
var SearchSite = function(site){
  this._site = site;
  this.render();
};

SearchSite.prototype.render = function(){
  var self = this;
  self.$dom = $(SearchSite.template(self._site));
};

SearchSite.prototype.getDOM = function(){
  return this.$dom;
};

SearchSite.prototype.isEnabled = function(){
  return !this.$dom.hasClass('disabled');
};

SearchSite.prototype.disable = function(){
  this.$dom.addClass('disabled');
  this.update();
};

SearchSite.prototype.enable = function(){
  this.$dom.removeClass('disabled');
  this.update();
};

SearchSite.prototype.update = function(){
  var val = this.isEnabled() ? 'enabled' : 'disabled';
  this.$dom.find('.' + val + '-btn').click();
};

/**
 * Settings
 */
var Settings = {
  _settings: {},
  _defaults: {
    sites: ['ancestry', 'familysearch', 'findmypast.co.uk', 'mocavo', 'myheritage']
  },
  load: function(){
    var cookie = cookies.getItem('settings'),
        parsed = {};
    if(cookie){
      try {
        parsed = JSON.parse(cookie);
      } catch(e){}
    }
    _.defaultsDeep(this._settings, parsed, this._defaults);
  },
  get: function(key){
    return this._settings[key];
  }
};