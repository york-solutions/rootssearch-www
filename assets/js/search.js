var defaultSites = ['ancestry', 'familysearch', 'findmypast.co.uk', 'mocavo', 'myheritage'],
    sitesList;

$(function(){
  SearchSite.template = Handlebars.compile($('#sites-template').html());
  sitesList = new SitesList('#sites-list');
  
  for(var prop in personData){
    $('#data_' + prop).val(personData[prop]);
  }

  // Add sites
  var availableSites = gensites.sites();
  for(var i = 0; i < availableSites.length; i++){
    var gensite = availableSites[i],
        searchSite = new SearchSite(gensite);
    if(defaultSites.indexOf(gensite.id) === -1){
      searchSite.disable();
    }
    sitesList.addSite(searchSite);
  }
  
  $('#site-settings-toggle').click(function(){
    sitesList.beginEditing();
  });
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
  self.$dom.find('.site-search-btn').click(function(){
    search(self._site.id);
  });
};

SearchSite.prototype.getDOM = function(){
  return this.$dom;
};

SearchSite.prototype.disable = function(){
  this.disabled = true;
  this.$dom.addClass('disabled');
};

SearchSite.prototype.enableEditing = function(){
  this.editing = true;
  this.$dom.addClass('editing');
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

SitesList.prototype.beginEditing = function(){
  for(var i = 0; i < this.sites.length; i++){
    this.sites[i].enableEditing();
  }
};
