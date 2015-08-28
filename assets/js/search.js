var sitesList;

$(function(){
  Settings.load();
  
  SearchSite.template = Handlebars.compile($('#sites-template').html());
  sitesList = new SitesList('#sites-list');
  new SettingsToggle('#site-settings-toggle');
  
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
      searchSite.enable();
    }
    sitesList.addSite(searchSite);
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
  this.disable();
};

SearchSite.prototype.render = function(){
  var self = this;
  self.$dom = $(SearchSite.template(self._site));
  self.$dom.find('.site-search-btn').click(function(){
    search(self._site.id);
  });
};

SearchSite.prototype.getDOM = function(){
  return this.$dom;
};

SearchSite.prototype.isEnabled = function(){
  return !this.$dom.hasClass('disabled');
};

SearchSite.prototype.disable = function(){
  this.$dom.addClass('disabled');
};

SearchSite.prototype.enable = function(){
  this.$dom.removeClass('disabled');
};

SearchSite.prototype.enableEditing = function(){
  this.$dom.addClass('editing');
  var val = this.isEnabled() ? 'enabled' : 'disabled';
  this.$dom.find('.' + val + '-btn').click();
};

SearchSite.prototype.disableEditing = function(){
  this.$dom.removeClass('editing');
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

SitesList.prototype.openEditing = function(){
  for(var i = 0; i < this.sites.length; i++){
    this.sites[i].enableEditing();
  }
};

SitesList.prototype.closeEditing = function(){
  for(var i = 0; i < this.sites.length; i++){
    this.sites[i].disableEditing();
  }
};

/**
 * Settings mode toggle
 */
var SettingsToggle = function(selector){
  var self = this;
  self.$container = $(selector).addClass('closed');
  self.$container.find('.open-editing').click(function(){
    self.$container.removeClass('closed').addClass('open');
    sitesList.openEditing();
  });
  self.$container.find('.close-editing').click(function(){
    self.$container.removeClass('open').addClass('closed');
    sitesList.closeEditing();
  });
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