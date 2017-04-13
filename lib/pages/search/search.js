const Settings = require('./settings-manager'),
      gensites = require('gensites'),
      gensearch = require('gensearch'),
      React = require('react'),
      ReactDOM = require('react-dom'),
      loaded = require('../loaded');

/**
 * Manage a site's display and settings
 */
class SearchSite extends React.Component {
  
  constructor(props){
    super(props);
    this.click = this.click.bind(this);
  }
  
  render() {
    return <div className="col-xs-12 col-sm-6 col-lg-4">
      <button className="site btn btn-lg btn-default" onClick={this.click}>
        <div className="site-name">{this.props.site.name}</div>
        <div className="site-search-btn"><span className="glyphicon glyphicon-search"></span></div>
      </button>
    </div>;
  }

  click(){
    search(this.props.site.id);
  }
}

function getPersonFormData(){
  const data = {},
        inputs = document.querySelectorAll('#search-form input');
  let prop;
  // Can't use Array.from() because of IE 11. Using forEach.call() is much
  // lighter than a polyfill.
  Array.prototype.forEach.call(inputs, function(input){
    prop = input.id.split('_')[1];
    data[prop] = input.value;
  });
  return data;
}

function search(site){
  const data = getPersonFormData(),
        url = gensearch(site, data);
  window.open(url, '_blank');
  ga('send', 'event', 'search', 'site', site);
}

document.addEventListener("DOMContentLoaded", function(){
  Settings.load();
  
  const sites = Settings.get('sites')
    .filter(site => {
      return gensites.site(site) && gensearch.sites[site];
    })
    .map(site => gensites.site(site))
    .map(site => <SearchSite key={site.id} site={site}></SearchSite>);
  
  ReactDOM.render(
    <div>{sites}</div>,
    document.getElementById('sites-list')
  );
  
  let isData = false,
      prop;
  for(prop in personData){
    document.getElementById('data_' + prop).value = personData[prop];
    isData = true;
  }
  
  if(isData){
    ga('send', 'event', 'search', 'dataLoaded');
  } else {
    ga('send', 'event', 'search', 'noData');
  }
  
  loaded();

});