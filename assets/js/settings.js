var Settings = require('./settings-manager'),
    gensites = require('./gensites.0.1.1.js');

var sitesList;

document.addEventListener("DOMContentLoaded", function(){
  Settings.load();
  SearchSite.template = Handlebars.compile($('#sites-template').html());
  sitesList = new SitesList('#sites-list');
});

/**
 * Manage a site's display and settings
 */
var SearchSite = function(site, enabled){
  this.site = site;
  this.enabled = enabled;
  this.changeFunc = function(){};
};

SearchSite.prototype.render = function(){
  var self = this;
  self.$dom = $(SearchSite.template({
    site: self.site,
    enabled: self.enabled
  }));
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

SearchSite.prototype.changed = function(){
  var self = this;
  setTimeout(function(){
    self.changeFunc();
  });
};

SearchSite.prototype.onChange = function(func){
  this.changeFunc = func;
};

/**
 * Manage the display of the list of site
 */
var SitesList = function(selector){
  this.$container = $(selector);
  this.sites = [];
  
  var availableSites = gensites.sites(),
      enabledSites = Settings.get('sites');
  for(var i = 0; i < availableSites.length; i++){
    var gensite = availableSites[i],
        enabled = enabledSites.indexOf(gensite.id) !== -1,
        searchSite = new SearchSite(gensite, enabled);
    this.addSite(searchSite);
  }
};

SitesList.prototype.addSite = function(site){
  var self = this;
  self.sites.push(site);
  self.$container.append(site.render().getDOM());
  site.onChange(function(){
    self.updateSettings();
  });
};

SitesList.prototype.updateSettings = function(){
  var enabledSites = [];
  for(var i = 0; i < this.sites.length; i++){
    if(this.sites[i].isEnabled()){
      enabledSites.push(this.sites[i].site.id);
    }
  }
  Settings.set('sites', enabledSites);
  Settings.save();
};
