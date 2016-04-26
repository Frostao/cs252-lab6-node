var auth2 = {};

  var prompt;

  var isRunning = false;

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
      $( '#my-signin2' ).fadeOut(0);
      document.getElementById( "enter" ).style.display='inline';
      // $("#body").effect("shake");
    }
  }

  var portArray = [];
  var usernameArray = [];
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

      // console.log("user = " + googleUser.El );
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
      /* if user has not entered all fields, proceed into here */
      $( '#my-signin2' ).fadeOut(0);
      document.getElementById( "enter" ).style.display='inline';
      document.getElementById( "instructions1" ).style.display='none';
      document.getElementById( "instructions2" ).style.display='none';
      // $("#body").effect("shake");
      refreshValues(false);
      profile = googleUser.getBasicProfile();
      // $("#body").effect("shake");
      
      //if field is left blank, highlight in red
      if(document.getElementById('host').value == "")
      {
       $(document.getElementById('host')).fadeIn().html('').css("border","1px solid red");
      }
      if(document.getElementById('port').value == "")
      {
        $(document.getElementById('port')).fadeIn().html('').css("border","1px solid red");
      }
      if(document.getElementById('username').value == "")
      {
        $(document.getElementById('username')).fadeIn().html('').css("border","1px solid red");
      }
      if(document.getElementById('password').value == "")
      {
        $(document.getElementById('password')).fadeIn().html('').css("border","1px solid red");
      }
  }

      $.get( 
        "/getConnections",
        { email: profile.getEmail() },
        function(data) {
          /* lag callback result */
          console.log( data );
          if( data ) {
            var host;
            var options = '';
            portArray = [];
            username = [];
            hostArray = [];
            for( i = 0; i < data.length; i++ ) {
              // console.log(data[i].connections);
              options += '<option value="' + data[i].host + '" />';
              hostArray[i] = data[i].host;
              portArray[i] = data[i].port;
              usernameArray[i] = data[i].username;
              // var temp = data[i].connections;
              // var array = temp.split( "," );
              // for( j = 0; j < array.length; j++ ) {
              //   console.log( array[i] );
              //   if( j == 1 ) {
              //     host = array[i];
              //   }
              // }
              // console.log( temp.substring(temp.indexOf( ","), temp.length ) );
            }
            document.getElementById( 'connections' ).innerHTML = options;
          }
        }
      ).done( function() {
          console.log( "jQuery done" );
      })
      .fail( function() {
          console.log( "jQuery failed" );
      });



    /* update hello message */
		document.getElementById( 'user' ).innerHTML =  'Hello, ' + profile.getName();
	}


/* this function is called when a host is selected from the drop-down list */
$(function() {
  $('#host').on('input',function() {
    var host = document.getElementById( 'host' ).value;
    // console.log( "input=" + document.getElementById( 'host' ).value );
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
    $("#password").focus();
  });
});

  /* called when the signOut button is pressed */
		function signOut() {
			refreshValues( true );
			var auth2 = gapi.auth2.getAuthInstance();
			auth2.signOut().then(function () {
        document.getElementById( 'host' ).value = "";
        document.getElementById( 'port' ).value = "";
        document.getElementById( 'username' ).value = "";
        document.getElementById( 'password' ).value = "";
	    		// $( '.g-signin2' ).fadeIn(500);
	    		// $( '.logoutWrapper' ).fadeOut(500);
          document.getElementById( 'user' ).innerHTML = "Welcome!"
	    		console.log('User signed out.');
	    	});
		}


		/* called when web app begins */
		function onLoad() {
			console.log( 'onLoad' );
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
 	updateGoogleUser();
  // document.getElementById('curr-user-cell').innerText =
    // JSON.stringify(user, undefined, 2);
  };

/**
 * Updates the properties in the Google User table using the current user.
 */
 var updateGoogleUser = function () {
 	if (googleUser) {
    // document.getElementById('user-id').innerText = googleUser.getId();
    // document.getElementById('user-scopes').innerText =
      // googleUser.getGrantedScopes();
    // document.getElementById('auth-response').innerText =
      // JSON.stringify(googleUser.getAuthResponse(), undefined, 2);
    } else {
    // document.getElementById('user-id').innerText = '--';
    // document.getElementById('user-scopes').innerText = '--';
    // document.getElementById('auth-response').innerText = '--';
  }
};

/**
 * Retrieves the current user and signed in states from the GoogleAuth
 * object.
 */
 var refreshValues = function( shouldChange ) {
 	if (auth2) {
 		console.log('Refreshing values...');

 		googleUser = auth2.currentUser.get();

    if( shouldChange ) {
      if (auth2.isSignedIn.get() == true) {
      	$('.loginWrapper').fadeOut(500);
      	$('.logoutWrapper').fadeIn(500);
        $('#signOutButton').fadeIn(0);
        document.getElementById( "instructions1" ).style.display='none';
        document.getElementById( "instructions2" ).style.display='none';
      } else {
      	$( '.logoutWrapper' ).fadeOut(0);
        $( '#signOutButton').fadeOut(0);
      	$( '.loginWrapper' ).fadeIn(50);
        document.getElementById( "instructions1" ).style.display='block';
        document.getElementById( "instructions2" ).style.display='block';
        document.getElementById( "enter" ).style.display='inline';
        $('#my-signin2').fadeIn(0);
      }
    } else {
      if (auth2.isSignedIn.get() == true) {
        $('#signOutButton').fadeIn(0);
      } else {
        $( '#signOutButton').fadeOut(0);
      }
    }

    updateGoogleUser();
    }
  }

  var returnToSelection = function() {
    console.log('returnToSelection');
    signOut();
    // $('.loginWrapper').fadeIn(500);
    // $('.logoutWrapper').fadeOut(0);
    // $('#signOutButton').fadeIn(0);
    // $('.body').getElementById( "enter" ).style.display='inline';
    // $('#my-signin2').fadeOut(0);
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

$(document).keypress(function(e) {
  /* enter pressed */
  if( e.which == 13 ) {
    /* treat this as login */
  }
});

    /* md-header */

// angular.module('myApp', ['ngMaterial'])
// .config(function($mdThemingProvider) {
//   $mdThemingProvider.theme('default')
//     .primaryPalette('pink')
//     .accentPalette('orange');
// });
  
  /* md-header */




// jQuery(document).ready(function($) {
//     var max = 4;
//     $('textarea').keypress(function(e) {
//         console.log( "jQuery: " + e.which );
//         /* if enter is pressed, prevent the default */
//         if (e.which == 13) {
//             console.log( "jQuery: " + e.which );
//             // e.preventDefault();
//         } else if (this.value.length > max) {
//             // Maximum exceeded
//             // this.value = this.value.substring(0, max);
//         }
//     });
// });


/* line to store each line of textarea */
var line = "";


jQuery(function($) {
  var input = $('#TextArea');
  input.on('keydown', function() {
    var key = event.keyCode || event.charCode;
    if( key == 8 || key == 46 ) {
        /* backspace was pressed */
        if( !line ) {
          return false;
        } else {
          line = line.slice( 0, -1 );
        }
    }
  });
});


  /* app controller */
  app.controller('AppCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

  $scope.enterPress = function(keyEvent) {
    if (keyEvent.which === 13) {
      /* enter pressed */
      /* print line to console log */
      console.log( 'line=' + line );

      if( line.localeCompare("clear") == 0 ) {
        document.getElementById( "TextArea" ).value = prompt;
        console.log("clear");
        line = "";
        return;
      }

      /* prevent the cursor from moving down */
      keyEvent.preventDefault();
      /* instead of default, just tack on a new line before adding the prompt */
      document.getElementById( "TextArea" ).value += "\n";

      /* reset line */
      /* get request */
      console.log(googleUser);
      console.log( "get:" + line );
      $.get( 
        "/get",
        { line: line,
          user: googleUser.El },
        function(data) {
          /* lag callback result */
          console.log( data );
          if( data ) {
            document.getElementById( "TextArea" ).value += data;
          }
        }
      ).done( function() {
          console.log( "jQuery done" );
          document.getElementById("TextArea").value += prompt;
      })
      .fail( function() {
          console.log( "jQuery failed" );
          document.getElementById("TextArea").value += prompt;
      });
      line = "";
      
      /* log enter pressed */
      console.log("enter pressed");
      /* print prompt to text area */
      // document.getElementById("TextArea").value += prompt;

    } else {
      /* convert keyEvent to string */
      var c = String.fromCharCode( keyEvent.which );
      /* concatenate string to line */
      line = line.concat( c );
    }
  }

  $scope.autoExpand = function(e) {
    var element = typeof e === 'object' ? e.target : document.getElementById(e);
    var scrollHeight = element.scrollHeight - 60; // replace 60 by the sum of padding-top and padding-bottom
    element.style.height = scrollHeight + "px";
  };

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };


  /* md-toolbar */
  // app.config(function($mdThemingProvider) {
  //   var customBlueMap = 		$mdThemingProvider.extendPalette('light-blue', {
  //     'contrastDefaultColor': 'light',
  //     'contrastDarkColors': ['50'],
  //     '50': 'ffffff'
  //   });
  //   $mdThemingProvider.definePalette('customBlue', customBlueMap);
  //   $mdThemingProvider.theme('default')
  //   .primaryPalette('customBlue', {
  //     'default': '500',
  //     'hue-1': '50'
  //   })
  //   .accentPalette('pink');
  //   $mdThemingProvider.theme('input', 'default')
  //   .primaryPalette('grey')
  // });
  /* md-toolbar */

  function expand() {
    $scope.autoExpand('TextArea');
  }
}]);
