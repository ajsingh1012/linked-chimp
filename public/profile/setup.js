var db, counter, loaded1 = false, loaded2 = false, loaded3 = false;

document.addEventListener('DOMContentLoaded', function() {
    var i = 0;
    var pics = firebase.storage().ref('profile-pictures');
    pics.listAll().then(function(result) {
        result.items.sort(function(a, b){
            // put in alphabetical order
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            if (x > y) {return -1;}
            if (x < y) {return 1;}
            return 0;
        })
        .forEach(function(imageRef) {
            var attribute = document.createElement('a');
            var data = imageRef.name.replace('.jpg', '');
            attribute.innerHTML = data;
            document.getElementById('image-dropdown').innerHTML += '<input type="radio" id="line' + i.toString() + '" name="line-style" value="' + i.toString() + '" > \
            <label for="line' + i.toString() + '"> \
            <img id="img' + i.toString() + '" style="width: 100px; height: 100px;"></img> \
            </label>';
            displayContent(imageRef, i);
            i++;
        })
        loaded3 = true;
        console.log(i);
        counter = i;
    }).catch(function(error) {
        console.log(error);
    });

    db = firebase.database().ref().child('usernames');

    document.getElementById('username').onchange = function() {checkValidityOfUsername(db, document.getElementById('username').value);}
    document.getElementById('invalidCheck').checked = false;
    document.getElementById('invalidCheck').onchange = function() {
        if(document.getElementById('invalidCheck').checked) {
            document.getElementById('invalidCheck').classList.remove('is-invalid');
        } else {
            document.getElementById('invalidCheck').classList.add('is-invalid');
        }
    };
    document.getElementById('firstName').onchange = function() {validateName(document.getElementById('firstName'));};
    document.getElementById('lastName').onchange = function() {validateName(document.getElementById('lastName'));};
    document.getElementById('city').onchange = function() {validateName(document.getElementById('city'));};
    document.getElementById('statement').onchange = function() {validateName(document.getElementById('statement'));};

    //listen for submit event
    document.getElementById('profile-form').addEventListener('submit', submitData);
    
    loaded1 = true;
});

function displayContent(imageRef, i) {
    imageRef.getDownloadURL().then(function(url) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var imageHolder = document.getElementById('img' + i.toString());
                imageHolder.setAttribute('src', url);
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send()
        console.log('file retrieved successfully');
    }).catch(function(error) {
        // Handle any errors
        console.log(error);
    });
}

var isLoaded = false, done = false;
var i = setInterval(() => {
    updateTrace();
    $("#trace").val($("input[name=line-style]:checked").val());
}, 100);

var j = setInterval(
    function(){
        var loaded4 = true;
        
        isLoaded = (document.getElementById('profile-form').auth != null);

        var children = document.getElementById('image-dropdown').children;
        for (var i = 0; i < children.length; i++) {
            for (var j = 0; j < children[i].children.length; j++) {
                if (children[i].children[j].src == '') {
                    loaded4 = false;
                }
            }
        }
        if((!done) && loaded1 && loaded2 && loaded3 && loaded4 && isLoaded) {
            var images = document.getElementById('image-dropdown').children;
            if(images.length == 2 * counter) {
                loadData();
                done = true;
                clearInterval(j);
            }
        }
    },
    100
);

function checkValidityOfUsername(database, username) {
    var isValid = false;
    if(username != '') {
        database.child(username).get().then((snapshot) => {
            if (snapshot.exists()) {
                firebase.database().ref('users/' + document.getElementById('profile-form').auth).get().then((snapshotb) => {
                    if (snapshotb.exists() && snapshotb.val().username == username) {
                        isValid = true;
                    } else {
                        isValid = false;
                    }
                    toggleValidity(isValid);
                });
            } else {
                isValid = true;
                toggleValidity(isValid);
            }
            
        }).catch((error) => {
            console.error(error);
        });
    }
    toggleValidity(isValid);
}

function toggleValidity(bool) {
    if (bool) {
        document.getElementById('username').classList.remove('is-invalid');
        document.getElementById('username').classList.add('is-valid');
    } else {
        document.getElementById('username').classList.remove('is-valid');
        document.getElementById('username').classList.add('is-invalid');
    }
}

function validateName(element) {
    if(element.value != '') {
        document.getElementById(element.id).classList.remove('is-invalid');
        document.getElementById(element.id).classList.add('is-valid');
    } else {
        document.getElementById(element.id).classList.remove('is-valid');
        document.getElementById(element.id).classList.add('is-invalid');
    }
}

function updateTrace() {
    if(document.getElementById('trace').value.length > 0) {
        document.getElementById('trace').classList.remove('is-invalid');
        document.getElementById('trace').classList.add('is-valid');
    } else {
        document.getElementById('trace').classList.add('is-invalid');
        document.getElementById('trace').classList.remove('is-valid');
    }
}

function loadData() {
    firebase.database().ref('users/' + document.querySelector('#profile-form').auth).get().then((snapshot) => {
        if (snapshot.exists()) {
            var data = snapshot.val();
            document.querySelector('#username').value = data.username;
            document.querySelector('#firstName').value = data.firstName;
            document.querySelector('#lastName').value = data.lastName;
            document.querySelector('#city').value = data.location;
            document.querySelector('#statement').value = data.statement.replace(/\\/gi, '\n');
            
            var picURL = data.profileURL;
            var children = document.getElementById('image-dropdown').children;
            for (var i = 0; i < children.length; i++) {
                for (var j = 0; j < children[i].children.length; j++) {
                    if (children[i].children[j].src == picURL) {
                        var str = children[i].children[j].id;
                        document.getElementById('line' + str.substring(str.length - 1, str.length)).checked = true;
                    }
                }
            }
        } else {
            console.log("No data available for current user");
        }
    }).catch((error) => {
        console.error(error);
    });
}

function submitData(e) {
    e.preventDefault();
    let username = document.querySelector('#username').value;
    let fname = document.querySelector('#firstName').value;
    let lname = document.querySelector('#lastName').value;
    let profilePic = document.getElementById('img' + document.querySelector('#trace').value).src;
    let location = document.querySelector('#city').value;
    let statement = document.querySelector('#statement').value;
    statement = statement.split('\n').join('\\')

    let authId = document.querySelector('#profile-form').auth;

    firebase.database().ref('users/' + document.querySelector('#profile-form').auth).get().then((snapshot) => {
        if (snapshot.exists()) {
            var data = snapshot.val();
            firebase.database().ref('usernames/' + data.username).remove().then({
                function() {
                    console.log("Update succeeded.")
                }
            }).catch(function(error) {
                console.log("Update failed: " + error.message)
            });
        } else {
            console.log("New user");
        }
        firebase.database().ref('usernames/' + username).set({
            username
        });
    }).catch((error) => {
        console.error(error);
    });

    firebase.database().ref('users/' + authId).set({
        username: username,
        firstName: fname,
        lastName: lname,
        profileURL: profilePic,
        location: location,
        statement: statement
    });

    

}