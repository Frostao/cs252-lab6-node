var auth2 = {};

  var prompt;

	function onSignIn(googleUser) {
    // document.location.href = "terminal.html"
		refreshValues();
		var profile = googleUser.getBasicProfile();
	  		console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	  		console.log('Name: ' + profile.getName());
	  		console.log('Image URL: ' + profile.getImageUrl());
	  		console.log('Email: ' + profile.getEmail());
	  		var host = document.getElementById( 'host' ).value;
	  		var port = document.getElementById( 'port' ).value;
        var username = document.getElementById( 'username' ).value;
        var password = document.getElementById( 'password' ).value;
        console.log( 'host: ' + host );
        console.log( 'port: ' + port );

        // $(document).ready(function(){
        // $("button").click(function(){
          console.log("user = " + googleUser.El );
          $.post("/connect",
          {
            host: host,
            port: port,
            username: username,
            password: password,
            user: googleUser.El
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

          
          if( host ) {
            prompt = host + "-> ";
          } else {
            prompt = "prompt-> ";
          }
          if( document.getElementById( "TextArea" ) && ( !document.getElementById("TextArea").value || document.getElementById("TextArea").value.indexOf(prompt) == -1 ) ) {
            document.getElementById("TextArea").value += prompt;
          }
			document.getElementById( 'user' ).innerHTML =  'Hello, ' + profile.getName();
		}
		function signOut() {
			refreshValues();
			var auth2 = gapi.auth2.getAuthInstance();
			auth2.signOut().then(function () {
        document.getElementById( 'host' ).value = "";
        document.getElementById( 'port' ).value = "";
        document.getElementById( 'username' ).value = "";
        document.getElementById( 'password' ).value = "";
	    		// $( '.g-signin2' ).fadeIn(500);
	    		// $( '.logoutWrapper' ).fadeOut(500);
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
  refreshValues();
};

/**
 * Listener method for sign-out live value.
 *
 * @param {boolean} val the updated signed out state.
 */
 var signinChanged = function (val) {
 	console.log('Signin state changed to ', val);
 	refreshValues();
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
 var refreshValues = function() {
 	if (auth2){
 		console.log('Refreshing values...');

 		googleUser = auth2.currentUser.get();

    // document.getElementById('curr-user-cell').innerText =
      // JSON.stringify(googleUser, undefined, 2);
    // document.getElementById('signed-in-cell').innerText =
      // auth2.isSignedIn.get();

      if (auth2.isSignedIn.get() == true) {
      	$('.loginWrapper').fadeOut(500);
      	$('.logoutWrapper').fadeIn(500);
      } else {
      	// document.getElementsByClassName( 'logoutWrapper' )[0].style.visibility="visible";
      	$( '.logoutWrapper' ).fadeOut(0);
      	$( '.loginWrapper' ).fadeIn(500);
      }


      updateGoogleUser();
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
      }) ;
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




  /* TODO header */