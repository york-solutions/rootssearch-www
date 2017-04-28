/**
 * Setup the FS SDK client singleton
 * 
 * TODO: refactor so that state is handled by Redux and this component
 * doesn't do any React rendering.
 */
 
const FamilySearch = require('fs-js-lite');
const store = require('./store');
const GedcomX = require('gedcomx-js');

/**
 * Add a custom method for oauth via a popup
 */
FamilySearch.prototype.oauthPopup = function(callback){
  
  // Open redirect window
  // TODO: position in the middle of the page horizontally
  let popup = window.open(this.oauthRedirectURL(), 'FSAUTH', 'height=800,width=600');

  // Poll the window's URL for the auth token response. While the window is
  // open to the login screen on familysearch.org, request the URL will throw
  // a security error so we swallow those and wait for the return to rs.io.
  let interval = setInterval(() => {
    try {
      
      // Parse the query params of the URL
      let queryParams = popup.location.search
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

module.exports = client;