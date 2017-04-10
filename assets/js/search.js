var Settings = require('./settings-manager'),
    gensites = require('gensites'),
    gensearch = require('gensearch');

var sitesList;

document.addEventListener("DOMContentLoaded", function(){
  Settings.load();
  
  sitesList = new SitesList('#sites-list');
  
  var isData = false;
  for(var prop in personData){
    $('#data_' + prop).val(personData[prop]);
    isData = true;
  }
  
  if(isData){
    ga('send', 'event', 'search', 'dataLoaded');
  } else {
    ga('send', 'event', 'search', 'noData');
  }

  // Add sites
  var enabledSites = Settings.get('sites');
  for(var i = 0; i < enabledSites.length; i++){
    var gensite = gensites.site(enabledSites[i]);
    if(gensite && gensearch.sites[enabledSites[i]]){
      sitesList.addSite(new SearchSite(gensite));
    }
  }
});

function search(siteKey){
  var data = getPersonFormData(),
      url = gensearch(siteKey, data);
  window.open(url, '_blank');
  ga('send', 'event', 'search', 'site', siteKey);
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
  this.site = site;
  this.render();
};

SearchSite.prototype.render = function(){
  var self = this;
  self.$dom = $(`<div class="col-xs-12 col-sm-6 col-lg-4">
    <button class="site btn btn-lg btn-default">
      <div class="site-name">${this.site.name}</div>
      <div class="site-search-btn"><span class="glyphicon glyphicon-search"></span></div>
    </div>
  </div>`);
  self.$dom.click(function(){
    search(self.site.id);
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