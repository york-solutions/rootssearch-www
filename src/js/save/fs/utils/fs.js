/**
 * Setup the FS SDK client singleton
 * 
 * TODO: refactor so that state is handled by Redux and this component
 * doesn't do any React rendering.
 */
 
const FamilySearch = require('fs-js-lite');
const store = require('../store');
const GedcomX = require('gedcomx-js');

/**
 * Add a custom method for oauth via a popup
 */
FamilySearch.prototype.oauthPopup = function(callback){
  
  // Open redirect window vertically and horizontally centered on the screen.
  // Horizontal centering doesn't work in Chrome when the original window is on
  // a second monitor: https://bugs.chromium.org/p/chromium/issues/detail?id=137681
  const width = 300,
        height = 500,
        left = Math.round((window.screen.width - width) / 2),
        top = Math.round((window.screen.height - height) / 2) - 50,
        features = `height=${height},width=${width},left=${left},top=${top}`;
  const popup = window.open(this.oauthRedirectURL(), 'FSAUTH', features);

  // Poll the window's URL for the auth token response. While the window is
  // open to the login screen on familysearch.org, request the URL will throw
  // a security error so we swallow those and wait for the return to rs.io.
  const interval = setInterval(() => {
    try {
      
      // Parse the query params of the URL
      const queryParams = popup.location.search
        .substring(1) // Remove the ?
        .split('&')
        .map(s => s.split('='))
        .reduce((params, p) => {
          params[p[0]] = p[1];
          return params;
        }, {});
        
      // Close the window and terminate polling
      clearInterval(interval);
      popup.close();
      
      if(queryParams.code) {
        this.oauthToken(queryParams.code, callback);
      } else if(queryParams.error) {
        callback(new Error(queryParams.error_description));
      } else {
        callback(new Error('Unknown authentication response'));
      }
    } catch(error) { }
  }, 1000);
};

const client = new FamilySearch({
  appKey: 'a02f100000PUcPnAAL',
  redirectUri: `${window.location.origin}/save/fs/oauth-redirect`,
  saveAccessToken: true
});

// Hydrate response data
client.addResponseMiddleware(function(client, request, response, next){
  if(response.data){
    if(response.data.entries){
      response.gedcomx = GedcomX.AtomFeed(response.data);
    }
    else if(response.data.access_token){
      response.gedcomx = GedcomX.OAuth2(response.data);
    }
    else {
      response.gedcomx = GedcomX(response.data);
    }
  }
  next();
});

// Add middleware that detects 401s
client.addResponseMiddleware(function(client, request, response, next){
  if(response.statusCode === 401){
    
    const clickHandler = function(){
      
      // Initiate auth
      client.oauthPopup(function(error, popupResponse){
        
        // On fail, return original response
        if(error){
          request.callback(null, response);
        }
      
        // On success, replace request
        else {
          store.dispatch({
            type: 'FS_AUTH_END'
          });
          
          // The current authorization middleware will only add the header if 
          // it's not already there, i.e. it doesn't override existing values so
          // delete the header which ensures that it gets reapplied with the new
          // access token value.
          delete request.headers['Authorization'];
          
          client._execute(request, function(error, replayResponse){
            setTimeout(function(){
              request.callback(error, replayResponse);
            });
          });
        }
      });
    };
    
    store.dispatch({
      type: 'FS_AUTH_BEGIN',
      onClick: clickHandler
    });
    
    return next(undefined, true);
  }
  next();
});

// See https://familysearch.org/developers/docs/guides/facts
client.supportedFactTypes = [
  'http://gedcomx.org/Birth',
  'http://gedcomx.org/Christening',
  'http://gedcomx.org/Death',
  'http://gedcomx.org/Burial',
  'http://gedcomx.org/Stillbirth',
  'http://gedcomx.org/BarMitzvah',
  'http://gedcomx.org/BatMitzvah',
  'http://gedcomx.org/MilitaryService',
  'http://gedcomx.org/Naturalization',
  'http://gedcomx.org/Residence',
  'http://gedcomx.org/Religion',
  'http://gedcomx.org/Occupation',
  'http://gedcomx.org/Cremation',
  'http://gedcomx.org/Caste',
  'http://gedcomx.org/Clan',
  'http://gedcomx.org/NationalId',
  'http://gedcomx.org/Nationality',
  'http://gedcomx.org/PhysicalDescription',
  'http://gedcomx.org/Ethnicity',
  'http://familysearch.org/v1/Affiliation',
  'http://familysearch.org/v1/BirthOrder',
  'http://familysearch.org/v1/DiedBeforeEight',
  'http://familysearch.org/v1/LifeSketch',
  'http://familysearch.org/v1/TitleOfNobility',
  'http://familysearch.org/v1/TribeName',
];

module.exports = client;