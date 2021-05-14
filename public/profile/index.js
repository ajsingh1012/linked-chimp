function logOut() {
    firebase.auth().signOut();
}

function initApp() {
    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            document.getElementById('profile-form').auth = user.uid;
            document.getElementById('prev').href = "../profile/index.html?id=" + user.uid;
            loaded2 = true;
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