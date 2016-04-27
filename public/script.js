var auth2 = {};

  function signInPressed() {
    console.log("sign in pressed");
  }

  /* called when user clicks "enter" (that's its id in index.html) button */
  function credentials() {
    /* get the values from the text boxes */
    var host = document.getElementById( 'host' ).value;
    var port = document.getElementById( 'port' ).value;
    var username = document.getElementById( 'username' ).value;
    var password = document.getElementById( 'password' ).value;

    /* if all text boxes have values in them, then continue */
    if( host && port && username && password ) {
      /* refresh values and refresh page (pass true) */
      refreshValues(true);
      /* update Google profile */
      var profile = googleUser.getBasicProfile();

      /* make post request with new credentials */
      $.post("/connect",
      {
        host: host,
        port: port,
        username: username,
        password: password,
        googleName: profile.getName(),
        googleEmail: profile.getEmail()
            // user: googleUser.El
        },
        function(data,status){
          //alert("Data: " + data + "\nStatus: " + status);
          var event = new Event('signedIn');
          var iframeWindow = document.getElementById("iframe").contentWindow; 
          iframeWindow.dispatchEvent(event);
        }).fail( function() {
          console.log( "jQuery post failed" );
          document.getElementById("TextArea").value = "noServerConnection";
        });
        console.log("post finished");
    } else {
      /* enters here if the user has not entered one of the fields */
      /* if field is left blank, highlight in red */
      if(document.getElementById('host').value == "")
      {
      	$(document.getElementById('host')).fadeIn().html('').css("border","1px solid red");
      }
      else
      {
        $(document.getElementById('host')).fadeIn().html('').css("border", "none");
      }
      if(document.getElementById('port').value == "")
      {
        $(document.getElementById('port')).fadeIn().html('').css("border","1px solid red");
      }
      else
      {
        $(document.getElementById('port')).fadeIn().html('').css("border", "none");
      }
      if(document.getElementById('username').value == "")
      {
        $(document.getElementById('username')).fadeIn().html('').css("border","1px solid red");
      }
      else
      {
        $(document.getElementById('username')).fadeIn().html('').css("border", "none");
      }	
      if(document.getElementById('password').value == "")
      {
        $(document.getElementById('password')).fadeIn().html('').css("border","1px solid red");
      }
      else
      {
        $(document.getElementById('password')).fadeIn().html('').css("border", "none");
      }
	    
      $( '#my-signin2' ).fadeOut(0);
      document.getElementById( "enter" ).style.display='inline';
      // $("#body").effect("shake");
    }
  }

  /* arrays for connections */
  /* array of ports */
  var portArray = [];
  /* array of usernames */
  var usernameArray = [];
  /* array of hosts */
  var hostArray = [];

  function onSignIn(googleUser) {
    /* get fileds from text areas */
    var host = document.getElementById( 'host' ).value;
    var port = document.getElementById( 'port' ).value;
    var username = document.getElementById( 'username' ).value;
    var password = document.getElementById( 'password' ).value;
    var profile;
    /* if user has entered all fields, then proceed into here */
    if( host && port && username && password ) {
      refreshValues(true);
      profile = googleUser.getBasicProfile();		
	  	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	  	console.log('Name: ' + profile.getName());
	  	console.log('Image URL: ' + profile.getImageUrl());
	  	console.log('Email: ' + profile.getEmail());
      console.log( 'host: ' + host );
      console.log( 'port: ' + port );

      /* would be Google user if ever useful: 
      console.log("user = " + googleUser.El ); 
      */

      /* post request upon login */
      $.post("/connect",
      {
        host: host,
        port: port,
        username: username,
        password: password,
        googleName: profile.getName(),
        googleEmail: profile.getEmail()
        // user: googleUser.El
      },
      function(data,status){
        var event = new Event('signedIn');
        /* get iframe */
        var iframeWindow = document.getElementById("iframe").contentWindow; 
        /* dispatch event on iframe object */
        iframeWindow.dispatchEvent(event);
      }).fail( function() {
        console.log( "jQuery post failed" );
        document.getElementById("TextArea").value = "noServerConnection";
      });
      console.log("post finished");
    } else {
      /* if user has not entered all fields, proceed into here */
      $( '#my-signin2' ).fadeOut(0);
      document.getElementById( "enter" ).style.display='inline';
      /* update 1st instruction */
      document.getElementById( "instructions1" ).innerHTML = "Signed In. Pick a connection."
      /* make 2nd instructions invisible */
      document.getElementById( "instructions2" ).style.display='none';
      /* update what shows */
      refreshValues(false);
      profile = googleUser.getBasicProfile();
      /* focus on the host to save user TIME! */
      $("#host").focus();
    }

      /* get request to get the user's connections */
      $.get( 
        "/getConnections",
        { email: profile.getEmail() },
        function(data) {
          /* lag callback result */
          console.log( data );
          if( data ) {
            var host;
            var options = '';
            /* clear portArray */
            portArray = [];
            /* clear usernameArray */
            usernameArray = [];
            /* clear hostArray */
            hostArray = [];
            /* for each connection in response, parse the results into their respective arrays */
            for( i = 0; i < data.length; i++ ) {
              /* build HTML for list */
              options += '<option value="' + data[i].host + '" />';
              hostArray[i] = data[i].host;
              portArray[i] = data[i].port;
              usernameArray[i] = data[i].username;
            }
            /* update the connections list with the values */
            document.getElementById( 'connections' ).innerHTML = options;
          }
        }
      ).done( function() {
          /* get request is done */
          console.log( "jQuery done" );
      })
      .fail( function() {
          /* get request failed */
          console.log( "jQuery failed" );
      });
    /* update hello message */
		document.getElementById( 'user' ).innerHTML =  'Hello, ' + profile.getName();
	}


/* this function is called when a host is selected from the drop-down list */
$(function() {
  $('#host').on('input',function() {
      if( document.getElementById( 'connections' ).innerHTML.localeCompare('') != 0) {
      var host = document.getElementById( 'host' ).value;
      var pos = hostArray.indexOf( host );
      if ( typeof portArray[ pos ] === "undefined" ) {
        document.getElementById( 'port' ).value = '';
      } else {
        document.getElementById( 'port' ).value = portArray[ pos ];
      }
      if( typeof usernameArray[ pos ] === "undefined" ) {
        document.getElementById( 'username' ).value = '';
      } else {
        document.getElementById( 'username' ).value = usernameArray[ pos ];
      }
      if( typeof portArray[ pos ] === "undefined" && typeof usernameArray[ pos ] === "undefined" ) {

      } else {
        $("#password").focus();
      }
    }
  });
});

  /* called when the signOut button is pressed */
  function signOut() {
    refreshValues( true );
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      /* clear text fields */
      document.getElementById( 'host' ).value = "";
      document.getElementById( 'port' ).value = "";
      document.getElementById( 'username' ).value = "";
      document.getElementById( 'password' ).value = "";
      document.getElementById( 'user' ).innerHTML = "Welcome!"
	    console.log('User signed out.');
      document.getElementById( 'connections' ).innerHTML = '';
      /* remove boarders from empty fields */
		  $(document.getElementById('host')).fadeIn().html('').css("border", "none");
		  $(document.getElementById('port')).fadeIn().html('').css("border", "none");
		  $(document.getElementById('username')).fadeIn().html('').css("border", "none");
		  $(document.getElementById('password')).fadeIn().html('').css("border", "none");
      /* reset instructions for login screen */
      document.getElementById( "instructions1" ).innerHTML = "Enter a new connection..."
		});
		}
		/* called when web app begins */
		function onLoad() {
		  /* refreshing the page undoes red highlighting */
		  $(document.getElementById('host')).fadeIn().html('').css("border", "none");
		  $(document.getElementById('port')).fadeIn().html('').css("border", "none");
		  $(document.getElementById('username')).fadeIn().html('').css("border", "none");
		  $(document.getElementById('password')).fadeIn().html('').css("border", "none");
      /* start app */
		  appStart();
		}


var googleUser; // The current user.

/**
 * Calls startAuth after Sign in V2 finishes setting up.
 */
 var appStart = function() {
 	console.log( 'appStart' );
 	$( '.logoutWrapper' ).fadeOut(0);
  $( '#signOutButton' ).fadeOut(0);
 	gapi.load('auth2', initSigninV2);
 };

/**
 * Initializes Signin v2 and sets up listeners.
 */
 var initSigninV2 = function() {
 	console.log( 'initSigninV2' );
	// auth2 = gapi.auth2.init({
    // client_id: 'CLIENT_ID.apps.googleusercontent.com',
    // scope: 'profile'
// });
  auth2 = gapi.auth2.getAuthInstance();

  // Listen for sign-in state changes.
  auth2.isSignedIn.listen(signinChanged);

  // Listen for changes to current user.
  auth2.currentUser.listen(userChanged);

  // Sign in the user if they are currently signed in.
  if (auth2.isSignedIn.get() == true) {
  	auth2.signIn();
  } 
  // Start with the current live values.
  refreshValues(true);
};

/**
 * Listener method for sign-out live value.
 *
 * @param {boolean} val the updated signed out state.
 */
 var signinChanged = function (val) {
 	console.log('Signin state changed to ', val);
 	refreshValues(!val);
  // document.getElementById('signed-in-cell').innerText = val;
};

/**
 * Listener method for when the user changes.
 *
 * @param {GoogleUser} user the updated user.
 */
 var userChanged = function (user) {
 	console.log('User now: ', user);
 	googleUser = user;
  // document.getElementById('curr-user-cell').innerText =
    // JSON.stringify(user, undefined, 2);
  };

/**
 * Retrieves the current user and signed in states from the GoogleAuth
 * object.
 */
 var refreshValues = function( shouldChange ) {
 	if (auth2) {
    /* let people know we are refreshing values */
 		console.log('Refreshing values...');
    /* get google user */
 		googleUser = auth2.currentUser.get();

    if( shouldChange ) {
      if (auth2.isSignedIn.get() == true) {
        /* user logged in, so go to terminal page */
      	$('.loginWrapper').fadeOut(500);
      	$('.logoutWrapper').fadeIn(500);
        $('#signOutButton').fadeIn(0);
        document.getElementById( "instructions1" ).style.display='none';
        document.getElementById( "instructions2" ).style.display='none';
      } else {
        /* user not logged in, so go to login page */
      	$( '.logoutWrapper' ).fadeOut(0);
        $( '#signOutButton').fadeOut(0);
      	$( '.loginWrapper' ).fadeIn(50);
        document.getElementById( "instructions1" ).style.display='block';
        document.getElementById( "instructions2" ).style.display='block';
        document.getElementById( "enter" ).style.display='none';
        /* show Google signin button */
        $('#my-signin2').fadeIn(0);
      }
    } else {
      if (auth2.isSignedIn.get() == true) {
        $('#signOutButton').fadeIn(0);
      } else {
        $( '#signOutButton').fadeOut(0);
      }
    }
    }
  }

  /* TODO adjusting box */
  var app = angular.module('myApp', ['ngMaterial'])
  .config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('light-blue')
    .warnPalette('red')
    .backgroundPalette('light-blue');
  });

/* keypress handler */
$(document).keypress(function(e) {
  /* enter pressed */
  if( e.which == 13 ) {
    /* if signed in, continue */
    if( document.getElementById( "enter" ).style.display !== 'none' ) {
      /* treat this as login */
      $("#enter").click();
    }

  }
});