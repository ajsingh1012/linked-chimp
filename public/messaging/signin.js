function logOut() {
    firebase.auth().signOut();
}

function initApp() {
    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            window.username = user.displayName;
        } else {
            // User is signed out.
            window.location.replace('../index.html');
        }
    });
    document.getElementById('log-out').addEventListener('click', logOut, false);
}

window.onload = function() {
    initApp();
};