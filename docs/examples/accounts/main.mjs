
import api from '../../../source/index.mjs';

/** 
 *	
 */
window.addEventListener('load', function() {
	
	/// 
	const rest = new api.RestClient( "https://demo.alpha" );
	
	
	///
	const divLog = document.getElementById("divLog");
	const divLoading = document.getElementById("divLoading");
	
	/** 
	 *	
	 *	@param {String} title
	 *	@param {String} message
	 */
	function displayLog( title, message ) {
		
		let strong = document.createElement('strong');
			strong.innerHTML = title;
			
		let p = document.createElement('p');
			p.innerHTML = message;
			p.style.color = '#f00';
			
		///
		divLog.style.display = "block";
		divLog.appendChild( strong );
		divLog.appendChild( p );
		
		///
		setTimeout(function() {
			
			divLog.style.display = "none";
			
			strong.remove();
			p.remove();
			
		}, 5000);
		
	}
	
	function loading( display = false ) {
		
		divLoading.style.display = display? 'block' : 'none';
		
	}
	
	function clearInputs() {
		
		let inputs = document.body.querySelectorAll('input');
		
		for( let item of inputs ) item.value = '';
		
	}
	
	function displayUserData( data ) {
		
		///
		location.hash = '#user';
		
		document.getElementById("preUserData").innerHTML = JSON.stringify( data, null, '\t' );
		
	}
	
	/// 
	/// 
	/// 
	
	document.getElementById("btnSignIn").addEventListener('click', function() {
		
		/// 
		const rest = new api.RestClient( "https://demo.alpha" );
		
		let inSignInUser = document.getElementById("inSignInUser");
		let inSignInPass = document.getElementById("inSignInPass");
		
		/// sha256 in base64
		let key = btoa( forge.md.sha256.create().update( inSignInPass.value ).digest().getBytes() );
		
		/// create a JsonWebToken
		const jwt = new api.auth.JsonWebToken(
			{ alg: 'HS256' }, 					/// header
			{ sub: inSignInUser.value }, 		/// payload
			key  								/// key
		);
		
		/// set to rest client
		rest.setAuth( jwt );
		
		loading(true);
		
		rest.get( '/accounts', function(response) {
			
			loading(false);
		
			if( response == null )
				return displayLog( 'Request Failure', 'The request has failed, check if the server is on.' );
			
			if( response.error )
				return displayLog( response.error, response.message );
			
			///
			displayUserData( response );
			
		});
		
	});
	
	document.getElementById("btnSignUp").addEventListener('click', function() {
		
		let inSignUpUser = document.getElementById("inSignUpUser");
		let inSignUpPass = document.getElementById("inSignUpPass");
		let inSignUpEmail = document.getElementById("inSignUpEmail");
		let inSignUpName = document.getElementById("inSignUpName");
		
		/// sha256 in base64
		let key = btoa( forge.md.sha256.create().update( inSignUpPass.value ).digest().getBytes() );
		
		///
		let data = {
			user: inSignUpUser.value, 
			key: key,
			email: inSignUpEmail.value,
			name: inSignUpName.value
		}
		
		loading(true);
		
		rest.post( '/accounts', data, function(response) {
			
			loading(false);
			
			if( response == null )
				return displayLog( 'Request Failure', 'The request has failed, check if the server is on.' );
			
			if( response.error )
				return displayLog( response.error, response.message );
			
			///
			displayUserData( response );
			
		});
		
	});
	
	document.getElementById("btnSignOut").addEventListener('click', function() {
		
		clearInputs();
		location.hash = '#sign-in';
		
	});
	
	///
	///
	///
	loading( false );
	
	if( location.hash.replace(/\#/g, '') == '' ) 
		location.hash = '#sign-in';
	
}, false);
