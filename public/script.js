var auth2 = {};




  var prompt;

	function onSignIn(googleUser) {
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
          $.post("/test-post",
          {
            host: host,
            port: port,
            username: username,
            password: password,
            user: googleUser.El
          },
          function(data,status){
            alert("Data: " + data + "\nStatus: " + status);
          });
          console.log("post finished");

          
          if( host ) {
            prompt = host + "-> ";
          } else {
            prompt = "prompt-> ";
          }
          if( !document.getElementById("TextArea").value ) {
            document.getElementById("TextArea").value += prompt;
          }
    // });
// });

	  // 		// sendRequestToServer
	  // 		xhrPut("SimpleServlet", function(responseText){
			// var mytitle = document.getElementById('message');
			// 	mytitle.innerHTML = responseText;
			// }, function(err){
			// console.log(err);
			// });

			// xhrPut( host );
			console.log('past xhrPut');





			document.getElementById( 'user' ).innerHTML =  'Hello, ' + profile.getName();
		}
		function signOut() {
			refreshValues();
			var auth2 = gapi.auth2.getAuthInstance();
			auth2.signOut().then(function () {
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

  app.controller('AppCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

      
               // $.get( 
               //    "result.php",
               //    { name: "Zara" },
               //    function(data) {
               //       $('#stage').html(data);
               //    }
               // );



// $scope.caretPos = 6;

// $scope.setSelectionRange = function(input, selectionStart, selectionEnd) {
//     if (input.setSelectionRange) {
//       input.focus();
//       input.setSelectionRange(selectionStart, selectionEnd);
//     }
//     else if (input.createTextRange) {
//       var range = input.createTextRange();
//       range.collapse(true);
//       range.moveEnd('character', selectionEnd);
//       range.moveStart('character', selectionStart);
//       range.select();
//     }
// };

// $scope.setCaretToPos = function() {
//      $scope.setSelectionRange(document.getElementById("myTextArea"), $scope.caretPos, $scope.caretPos);
// };



        

  $scope.enterPress = function(keyEvent) {
    if (keyEvent.which === 13) {
      /* enter pressed */
      /* print line to console log */
      console.log( 'line=' + line );

      /* prevent the cursor from moving down */
      keyEvent.preventDefault();

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
            document.getElementById( "TextArea" ).value += "\n" + data;
          }
        } 
      );
      line = "";

      // document.getElementById( "TextArea" ).value += "\nDocuments\nUsers\n";
      
      // setCaretToPos( "TextArea", 0 );

      /* log enter pressed */
      console.log("enter pressed");

      // prompt = "prompt-> ";
      // console.log( document.getElementById("TextArea").value.charCodeAt(document.getElementById("TextArea").value.length ) );
      // document.getElementById("TextArea").value = document.getElementById("TextArea").value.replace(/\n$/, "");   //.slice(0, -1);
      // console.log( document.getElementById("TextArea").value.charCodeAt( document.getElementById("TextArea").value.length ) );
      // if (document.getElementById("TextArea").setSelectionRange) {
      // document.getElementById("TextArea").focus();
      // document.getElementById("TextArea").setSelectionRange(0, document.getElementById("TextArea").value.length - 2 );
      // }
      console.log(document.getElementById("TextArea").value+":");
      // document.getElementById( "TextArea" ).value += '\n';
      document.getElementById("TextArea").value += prompt;

    } else if( keyEvent.which == keyEvent.VK_BACK_SPACE ) {
      /* TODO catch backspace to see if we should not remove prompt */
      console.log("backspace pressed");
    } else {
      /* convert keyEvent to string */
      var c = String.fromCharCode( keyEvent.which );
      /* concatenate string to line */
      line = line.concat( c );
      // console.log( keyEvent.which );
      // console.log( line );
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

/*
 * HeadsUp 1.5.6
 * @author Kyle Foster (@hkfoster)
 * @license MIT
 */
 ;
 (function(window, document, undefined) {

  'use strict';

  // Extend function
  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  // Throttle function (http://bit.ly/1eJxOqL)
  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var previous, deferTimer;
    return function() {
      var context = scope || this,
      current = Date.now(),
      args = arguments;
      if (previous && current < previous + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          previous = current;
          fn.apply(context, args);
        }, threshhold);
      } else {
        previous = current;
        fn.apply(context, args);
      }
    };
  }

  // Class management functions
  function classReg(className) {
    return new RegExp('(^|\\s+)' + className + '(\\s+|$)');
  }

  function hasClass(el, cl) {
    return classReg(cl).test(el.className);
  }

  function addClass(el, cl) {
    if (!hasClass(el, cl)) {
      el.className = el.className + ' ' + cl;
    }
  }

  function removeClass(el, cl) {
    el.className = el.className.replace(classReg(cl), ' ');
  }

  // Main function definition
  function headsUp(selector, options) {
    this.selector = document.querySelector(selector);
    this.options = extend(this.defaults, options);
    this.init();
  }

  // Overridable defaults
  headsUp.prototype = {
    defaults: {
      delay: 300,
      sensitivity: 20
    },

    // Init function
    init: function(selector) {

      var self = this,
      options = self.options,
      selector = self.selector,
      oldScrollY = 0,
      winHeight;

      // Resize handler function
      function resizeHandler() {
        winHeight = window.innerHeight;
        return winHeight;
      }

      // Scroll handler function
      function scrollHandler() {

        // Scoped variables
        var newScrollY = window.pageYOffset,
        docHeight = document.body.scrollHeight,
        pastDelay = newScrollY > options.delay,
        goingDown = newScrollY > oldScrollY,
        fastEnough = newScrollY < oldScrollY - options.sensitivity,
        rockBottom = newScrollY < 0 || newScrollY + winHeight >= docHeight;

        // Where the magic happens
        if (pastDelay && goingDown) {
          addClass(selector, 'heads-up');
        } else if (!goingDown && fastEnough && !rockBottom || !pastDelay) {
          removeClass(selector, 'heads-up');
        }

        // Keep on keeping on
        oldScrollY = newScrollY;
      }

      // Attach listeners
      if (selector) {

        // Trigger initial resize
        resizeHandler();

        // Resize function listener
        window.addEventListener('resize', throttle(resizeHandler), false);

        // Scroll function listener
        window.addEventListener('scroll', throttle(scrollHandler, 100), false);
      }
    }
  };

  window.headsUp = headsUp;

})(window, document);

// Instantiate HeadsUp
new headsUp('.main-header');