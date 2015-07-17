var defaultSites = ['ancestry', 'familysearch', 'findmypast.co.uk', 'mocavo', 'myheritage'],
    siteTemplate = '';

$(function(){
  siteTemplate = Handlebars.compile($('#sites-template').html());
  
  for(var prop in personData){
    $('#data_' + prop).val(personData[prop]);
  }

  // Add sites
  for(var i = 0; i < defaultSites.length; i++){
    addSiteButton(defaultSites[i]);
  }
});

function addSiteButton(siteKey){
  var site = gensites.site(siteKey);
  if(!site){
    console.error('gensites is missing site', siteKey);
    site = {
      id: siteKey,
      name: siteKey
    };
  }
  $site = $(siteTemplate(site)).appendTo('#sites-list');
  $site.find('.site-search-btn').click(function(){
    search(siteKey);
  });
}

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
