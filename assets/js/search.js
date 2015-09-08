var sitesList;

$(function(){
  Settings.load();
  
  SearchSite.template = Handlebars.compile($('#sites-template').html());
  sitesList = new SitesList('#sites-list');
  
  for(var prop in personData){
    $('#data_' + prop).val(personData[prop]);
  }

  // Add sites
  var availableSites = gensites.sites(),
      enabledSites = Settings.get('sites');
  for(var i = 0; i < availableSites.length; i++){
    var gensite = availableSites[i],
        searchSite = new SearchSite(gensite);
    if(enabledSites.indexOf(gensite.id) !== -1){
      sitesList.addSite(searchSite);
    }
  }

});

function search(siteKey){
  var data = getPersonFormData(),
      url = gensearch(siteKey, data);
  window.open(url, '_blank');
}

function getPersonFormData(){
  var data = {};
  $('#search-form input').each(function(){
    var prop = $(this).attr('id').split('_')[1];
    data[prop] = $(this).val();
  });
  return data;
}

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
  self.$dom.click(function(){
    search(self._site.id);
  });
};

SearchSite.prototype.getDOM = function(){
  return this.$dom;
};

/**
 * Manage the display of the list of site
 */
var SitesList = function(selector){
  this.$container = $(selector);
  this.sites = [];
};

SitesList.prototype.addSite = function(site){
  this.sites.push(site);
  this.$container.append(site.getDOM());
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