/**
 * Setup the FS SDK client singleton
 */
 
const FamilySearch = require('fs-js-lite');
const React = require('react');
const ReactDOM = require('react-dom');
const FSAuthModal = require('./components/FSAuthModal');

/**
 * Add a custom method for oauth via a popup
 */
FamilySearch.prototype.oauthPopup = function(callback){
  
  // Open redirect window
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
          ReactDOM.unmountComponentAtNode(document.getElementById('fs-auth'))
          client._execute(request, function(error, replayResponse){
            setTimeout(function(){
              request.callback(error, replayResponse);
            });
          });
        }
      });
    };
    
    ReactDOM.render(
      <FSAuthModal onClick={clickHandler} />,
      document.getElementById('fs-auth')
    );
    
    return next(undefined, true);
  }
  next();
});

module.exports = client;