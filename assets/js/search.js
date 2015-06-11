$(function(){
  for(var prop in personData){
    $('#data_' + prop).val(personData[prop]);
  }
  
  for(var siteKey in gensearch.sites){
    addSiteButton(siteKey);
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
  $('#sites-list').append(
    $('<div class="site-col col-md-3 col-sm-4 col-xs-6">').append(
      $('<button class="btn btn-rs btn-lg">').text(site.name).click(function(){
        search(siteKey);
      })
    )
  );
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