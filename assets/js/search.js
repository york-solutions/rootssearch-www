var Settings = require('./settings-manager'),
    gensites = require('gensites'),
    gensearch = require('gensearch'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery');

/**
 * Manage a site's display and settings
 */
class SearchSite extends React.Component {
  
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
  }
  
  render() {
    return <div className="col-xs-12 col-sm-6 col-lg-4">
      <button className="site btn btn-lg btn-default" onClick={this.search}>
        <div className="site-name">{this.props.site.name}</div>
        <div className="site-search-btn"><span className="glyphicon glyphicon-search"></span></div>
      </button>
    </div>;
  }

  search(){
    var data = getPersonFormData(),
        url = gensearch(this.props.site.id, data);
    window.open(url, '_blank');
    ga('send', 'event', 'search', 'site', this.props.site.id);
  }
}

document.addEventListener("DOMContentLoaded", function(){
  Settings.load();
  
  let sites = Settings.get('sites')
    .filter(site => {
      return gensites.site(site) && gensearch.sites[site];
    })
    .map(site => gensites.site(site))
    .map(site => <SearchSite key={site.id} site={site}></SearchSite>);
  
  ReactDOM.render(
    <div>{sites}</div>,
    document.getElementById('sites-list')
  );
  
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

});

function getPersonFormData(){
  var data = {};
  $('#search-form input').each(function(){
    var prop = $(this).attr('id').split('_')[1];
    data[prop] = $(this).val();
  });
  return data;
}