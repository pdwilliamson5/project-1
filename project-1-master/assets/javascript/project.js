$(document).ready(function(){
	// FIREBASE INITIALIZE
	var config = {
	    apiKey: "AIzaSyBDm5nT9v8GJXej3TZwLHfkgt55HGXwOYA",
	    authDomain: "dfw-music.firebaseapp.com",
	    databaseURL: "https://dfw-music.firebaseio.com",
	    projectId: "dfw-music",
	    storageBucket: "dfw-music.appspot.com",
	    messagingSenderId: "640782752126"
	  };
	firebase.initializeApp(config);

	var userBase = firebase.auth();
	var user = firebase.auth().currentUser;
	var userEmail;
	var userPswrd;
	var venueID;
	var hoods=["Deep Ellum","Downtown & Uptown","South Dallas","East Dallas"]
	var featVen;
	var featShow = [];
	var venueName;
	var showDate;
	var headliner;
	var support=[];
	var index = [];
	var featShowDiv;
	var t = 0;
	var eventArray=[];
	

	// CHECKS TO SEE IF A USER is signed in
	firebase.auth().onAuthStateChanged(function(user){
		if(user){
			console.log(user);
			$("#userNav").css("display","inline-block");
			$("#outBtn").css("display","inline-block");
			$("#signBtn").css("display","none");
			console.log(userBase.currentUser.email);
			$("#userNav").text(userBase.currentUser.displayName);
			console.log("displayName: "+userBase.currentUser.displayName);
		}
	});

// SIGN IN FUNCTION
	function signIn(){
		firebase.auth().signInWithEmailAndPassword(userEmail, userPswrd).catch(function(error) {
		  // Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		  // ...
		});
	};

	$("#signInBtn").on("click", function(){
		userEmail = $("#userEmail").val().trim();
		userPswrd = $("#userPassword").val().trim();
		signIn();
	});

	// $("#googleAuth").on("click",function(){
	// 	// event.preventDefault();
	// 	var provider = new firebase.auth.GoogleAuthProvider();
	// 	firebase.auth().signInWithRedirect(provider).then(function(result) {
	// 		// This gives you a Google Access Token. You can use it to access the Google API.
	// 		var token = result.credential.accessToken;
	// 		// The signed-in user info.
	// 		var user = result.user;
	// 		// ...
	// 	}).catch(function(error) {
	// 		// Handle Errors here.
	// 		var errorCode = error.code;
	// 		var errorMessage = error.message;
	// 		// The email of the user's account used.
	// 		var email = error.email;
	// 		// The firebase.auth.AuthCredential type that was used.
	// 		var credential = error.credential;
	// 		// ...
	// 	});
	// });

	// SIGN OUT
	$("#outBtn").on("click",function(){
		$("#userNav").css("display","none");
		$("#outBtn").css("display","none");
		$("#signBtn").css("display","inline-block");
		firebase.auth().signOut().then(function() {
		  console.log('Signed Out');
		}, function(error) {
		  console.error('Sign Out Error', error);
		});
	});	


	// CREATE NEW ACCOUNT 
	$("#submitAcct").on("click",function(){
  		event.preventDefault();
  		var createEmail = $("#createEmail").val().trim();
  		console.log(createEmail);
  		var createPswrd = $("#createPassword").val().trim();
  		console.log(createPswrd);
  		userBase.createUserWithEmailAndPassword(createEmail,createPswrd).catch(function(error) {
		  // Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		});
		userEmail = createEmail;
		userPswrd = createEmail;
		signIn();
  		var createName = $("#createUsername").val().trim();
  		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				user.updateProfile({
					displayName: createName,
					}).then(function() {
					  // Update successful.
					  console.log("display name "+displayName);
					}).catch(function(error) {
					  // An error happened.
				});
			}
		});
  	});

	// SONG KICK API
	function venueAPI(){
		var queryURL = "https://api.songkick.com/api/3.0/venues/"+venueID+"/calendar.json?apikey=ENjLM092JqaXsW2i";
	
		$.ajax({
			url: queryURL,
			method: "GET"
		})
	.done(function(response){
		// console.log(response);
		if(response.resultsPage.totalEntries == 0){
			y = Math.floor(Math.random() * featVen.length);
			venueID = featVen[y].id;
			venueAPI();
		} else {
			var j = Math.floor(Math.random()*response.resultsPage.results.event.length);
			console.log(response.resultsPage.results.event[j]);
			var featShow = response.resultsPage.results.event[j];
			headliner = featShow.performance[0].displayName;
			console.log("headliner: "+headliner);
			featShowDiv = $("<div class='showDiv' id='hood"+t+"'>");
			featShowDiv.append("<h1 class='headliner'>"+headliner+"</h1>");
			if(featShow.performance.length > 1){
				for (var a = 1; a<featShow.performance.length; a++) {
					support.push(" "+featShow.performance[a].displayName);
				};
				console.log("support: "+support);
				featShowDiv.append("<h3 class='support'>with "+support+"</h3>");
			};
			venueName = featShow.venue.displayName;
			console.log("Venue: "+venueName);
			featShowDiv.append("<h3 class='ven'>"+venueName+"</h3>");
			date = moment(featShow.start.date).format("MMM D");
			featShowDiv.append("<h3 class='date'>"+date+"</h3>");
			t++;
			console.log("t: "+t);
			$("#featured-shows").append(featShowDiv);
		}
	});
	};

	// front page featured events
	function featureVenues(){
		for (i=0;i<hoods.length;i++){
			if (venues.neighborhood = hoods[i]){
				featVen = venues;
				var x = Math.floor(Math.random() * featVen.length);
				console.log("x: "+x);
				venueID = featVen[x].id;
				console.log("featured venue "+venueID);
				venueAPI();
			};
		};
	};

	featureVenues();
	
// venue specific page 
	function venueList(){
		var hoodName = localStorage.getItem("name");
		console.log("hoodName: "+hoodName);
		$("#hoodVenues").append("<ul class='places'>");
		for(f=0; f < venues.length; f++){
			if(venues[f].neighborhood == hoodName){
				var vName =venues[f].name;
				var vID = venues[f].id;
				$(".places").append("<li><a class='vens' data='"+vID+"' href='#venueCalendar'>"+vName+"</a></li>");
			}
		};

	};
	
	$(".hoods").on("click",function(){
		var name = $(this).attr("data");
		localStorage.removeItem("name");
		localStorage.setItem("name",name);
		console.log(localStorage.getItem("name"));
		$("#hoodName").text(localStorage.getItem("name"));
		$("#hoodVenues").empty();
		venueList();
	});

	$(document).on("click",".vens",function(){
		$("#venueCalendar").css("display","block");
		var thisID = $(this).attr("data");
		var thisVenue;
		for (var w = 0; w < venues.length; w++) {
			if (venues[w].id==thisID){
				thisVenue=venues[w]
			}
		};
		var calendarURL = "https://api.songkick.com/api/3.0/venues/"+thisID+"/calendar.json?apikey=ENjLM092JqaXsW2i";
	
		$.ajax({
			url: calendarURL,
			method: "GET"
		})
		.done(function(response){
			// console.log(response);
			for (var c = 0; c <5;c++){
				if(response == undefined){
					break;
				} else {
					var calendarMaster = response.resultsPage.results.event[c];
					var calSup=[];
					var calDate;
					var calendar = $("<div class='calDiv' id='entry"+c+"'>");
					
					var calHead = calendarMaster.performance[0].artist.displayName;
					calendar.append("<h3 class='star'>"+calHead+"</h3>");
					if(calendarMaster.performance.length > 1){
							for (var w = 1; w<calendarMaster.performance.length; w++) {
								calSup.push(" "+calendarMaster.performance[w].displayName);
							};
						console.log("support: "+calSup);
						calendar.append("<h3 class='perfs'>with "+calSup+"</h3>");
						}
					// console.log(calendarMaster);
					calDat = moment(calendarMaster.start.date).format("MMM D");
					calendar.append("<h3 class='date'>"+calDat+"</h3>");
					var calVen = thisVenue.name;
					// console.log(calVen);
					var addBtn = $("<button type='button' class='btn btn-light btn-sm addBtn' data-button='{venue:'"+calVen+"',headliner:'"+calHead+"',date:'"+calDat+"',support:'"+calSup+"'}"+"></button");
					// addBtn.data("data-button={venue:'"+calVen+"',headliner:'"+calHead+"',date:'"+calDat+"',support:'"+calSup+"'}");
					addBtn.text("+");
					calendar.append(addBtn);
					$("#venInfo").append(calendar);
					// calDiv.css("display","inline-block");
				};
			}
		});
		$("#venInfo").empty();
		console.log(thisVenue);
		$("#venInfo").prepend("<h1 class='thisVenName'>"+thisVenue.name+"</h1>");
	});

	$("#calendarDismiss").on("click",function(){
		$("#venueCalendar").css("display","none")
	})

	$("#hoodName").text(localStorage.getItem("name"));
	venueList();


$(document).on("click",".addBtn",function(){
	console.log(this);
	});
})