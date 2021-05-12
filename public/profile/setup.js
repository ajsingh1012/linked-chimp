var pics;

document.addEventListener('DOMContentLoaded', function() {
    var i = 0;
    pics = firebase.storage().ref('profile-pictures');
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
    }).catch(function(error) {
        console.log(error);
    });
});

function displayContent(imageRef, i) {
    imageRef.getDownloadURL().then(function(url) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(url);
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

/*the only js is to continuously checking the value of the dropdown. for posterity*/
var i = setInterval(function(){$("#trace").val($("input[name=line-style]:checked").val());},100);