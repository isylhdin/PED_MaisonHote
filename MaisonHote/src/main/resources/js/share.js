/**
 * FACEBOOK
 */
function facebookLogin() {
	FB.init({
		appId : '259179997550813',
		// check login status
		status : true,
		// enable cookies to allow the server to access the session
		cookie : true,
		// parse XFBML
		xfbml : true
	});
  
	FB.login(function(response) {
		if (response.authResponse) {
			postOnWall();
		} else {
			alert('Impossible de se connecter à facebook');
		}
	});
}

function postOnWall() {

	var obj = {
		method: 'feed'
	};

	function callback(response) {
		if (response && response.post_id) {
			alert('Post was published.');
		} else {
			alert('Post was not published.');
		}
	}

	FB.ui(obj, callback);
}

// Load the SDK Asynchronously
(function(d) {
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement('script');
	js.id = id; js.async = true;
	js.src = '//connect.facebook.net/en_US/all.js';
	ref.parentNode.insertBefore(js, ref);
} (document));
  
/**
 * TWITTER
 */
/*
(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs"));
 */