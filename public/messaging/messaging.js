var db, fetchChat;

document.addEventListener('DOMContentLoaded', function() {
    db = firebase.database();
    fetchChat = db.ref("messages/");
    fetchChat.on("child_added", loadMessages);
});
  
document.getElementById("message-form").addEventListener("submit", sendMessage);

function sendMessage(e) {
    e.preventDefault();
    username = window.username;
  
    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;
  
    // clear the input box
    messageInput.value = "";
  
    //auto scroll to bottom
    document
      .getElementById("messages")
      .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    console.log(message);
  
    // create db collection and send in the data
    if(message != '') {
      db.ref("messages/" + timestamp).set({
        username,
        message,
      });
    }
  }

function loadMessages(snapshot) {
    const messages = snapshot.val();
    const message = `<li class=${
      username === messages.username ? "sent" : "receive"
    }><span>${messages.username}: </span>${messages.message}</li>`;
    // append the message on the page
    document.getElementById("messages").innerHTML += message;
}