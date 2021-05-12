function toggleSignIn() {
    if (!firebase.auth().currentUser) {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
      });
    } else {
      firebase.auth().signOut();
    }
    document.getElementById('google-sign-in').disabled = true;
  }

function initApp() {
    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            window.location.replace('home/index.html');
        } else {
            // User is signed out.
            //document.getElementById('google-sign-in').innerHTML = 'Sign in with Google';
        }
        document.getElementById('google-sign-in').disabled = false;
    });
    document.getElementById('google-sign-in').addEventListener('click', toggleSignIn, false);
}

window.onload = function() {
    initApp();
};