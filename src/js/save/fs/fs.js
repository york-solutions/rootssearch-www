/**
 * Setup the FS SDK client singleton
 */
 
const FamilySearch = require('fs-js-lite');

/**
 * Add a custom method for oauth via a popup
 */
FamilySearch.prototype.oauthPopup = function(callback){
  
  // Open redirect window
  let window = window.open(this.oauthRedirectURL(), 'FSAUTH', 'height=800,width=600');
  
  // Poll for auth change
  let interval = setInterval(function(){
    console.log(window.location.href);
  }, 1000);
};

const client = new FamilySearch({
  appKey: '',
  redirectUri: '/save/fs/oauth-redirect',
  saveAccessToken: true
});

// Add middleware that detects 401s
client.addResponseMiddleware(function(client, request, response, next){
  if(response.statusCode === 401){
    
    // Initiate auth
    client.oauthPopup(function(error, popupResponse){
      
      // On fail, return original response
      if(error){
        request.callback(null, response);
      }
    
      // On success, replace request
      client._execute(request, function(error, replayResponse){
        setTimeout(function(){
          request.callback(error, replayResponse);
        });
      });
      
    });
    
    return next(undefined, true);
  }
  next();
});

module.exports = client;