//this.domain = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
//this.nsp = '/' + window.location.hostname;

var server = ""

var currentRoom = "public";

const socket = io("http://localhost:7000/" + "wpdev.local");

async function fetchUser() {
  try {
    return await axios.get('https://api.randomuser.me/').then(user => {
      return user
    });
  } catch (e) {
    console.log(e);
  }
}

socket.on("connect", () => {

  fetchUser().then(function (user) {
    var user = user.data.results[0];
    socket.emit("login", user);
    socket.emit("joinRoom", "public");
  })

});

jQuery("body").on("click", ".close-room-sidebar", function(e) {
  jQuery(this).parent().parent().parent().hide("slide", { direction: "right" }, 1000);
  e.preventDefault();
});

jQuery("body").on("click", ".open-room-sidebar", function(e) {
  jQuery("body").find("a.close-room-sidebar").parent().parent().parent().show("slide", { direction: "right" }, 1000).removeClass("hidden");
  e.preventDefault();
});


jQuery('body').on("focus", ".input", function(e) {
  jQuery(this).empty()
});

jQuery(document).on("keypress", ".input", function(e) {
  var keycode = (e.keyCode ? e.keyCode : e.which);
  if(keycode == 13 && !e.shiftKey) {
    var socketID = jQuery(this).attr("data-socketid");
    socket.emit("room", {room: currentRoom, msg: jQuery(this).html()});
    jQuery(this).empty()
    e.preventDefault();
  }
})

jQuery("body").on("click", "#online-user-list ul li", function(e) {
  e.preventDefault();
  var socketID = jQuery(this).attr("data-socketid");
  socket.emit("direct", {socketID: socketID, msg: "cool"});
})

jQuery("body").on("click", ".leave-room-btn", function(e) {
  e.preventDefault();
  socket.emit("leaveRoom", "public");
})

socket.on('updateMessages', function (data) {
    var message_html = jQuery('.comment-blank').clone();
    jQuery(message_html).find(".author").text(data.data.login.username);
    jQuery(message_html).find(".text").html(data.msg);
    jQuery(message_html).find(".avatar").attr("src", data.data.picture.thumbnail);
    jQuery(message_html).removeClass("comment-blank hidden-override hidden").addClass("comment");
    jQuery('.comments').prepend(message_html);
});

socket.on('join', function (data) {
  console.log(data);
  jQuery("#current-room-name-title").text("#" + currentRoom);
});

socket.on('leave', function (data) {
  console.log(data);
});

socket.on('exit', function (data) {
  console.log(data);
});

socket.on('direct', function (obj) {
  console.log(obj);
});

socket.on("online", (data) => {
  
  jQuery("#online-user-list div:nth-child(1) span").text(data.length);

  jQuery("#online-user-list ul li:not([class*='hidden-override'])").remove();
  jQuery.each(data, function (index, userInfo) {
      var userLI = jQuery("#online-user-list ul li[class*='hidden-override']").clone().removeClass("hidden-override");
      userLI.find("span:nth-child(2)").text(userInfo.user.login.username).parent().attr("data-username", userInfo.user.login.username).attr("data-socketid", userInfo.user.socketID);
      userLI.appendTo("#online-user-list ul");
  });

});

socket.on("onlineRoomUserList", (data) => {

  jQuery("#online-user-room-list div:nth-child(1) span").text(data.length);

  jQuery("#online-user-room-list ul li:not([class*='hidden-override'])").remove();

  jQuery.each(data, function (index, userInfo) {
    var userLI = jQuery("#online-user-room-list ul li[class*='hidden-override']").clone().removeClass("hidden-override");
    userLI.find("span:nth-child(2)").text(userInfo.data.user.login.username);
    userLI.appendTo("#online-user-room-list ul");
  });

});

socket.on("disconnect", () => {
  
});

socket.on("connect_error", (err) => {
  console.log(err instanceof Error); // true
  console.log(err.message); // not authorized
  console.log(err.data); // { content: "Please retry later" }
});