
/** Http
 *	
 *	@ref https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
 *	
 */
export default class Http {
	
	/// 4.5. Using HTTP Methods
	static GET = "GET";
	static OPTIONS = "OPTIONS";
	static POST = "POST";
	static PUT = "PUT";
	static DELETE = "DELETE";
	static PATCH = "PATCH";
	
	
	/// Response type
	static TEXT = "text";
	static JSON = "json";
	static XML = "document";
	static BUFFER = "arraybuffer";
	static BLOB = "blob";
	
	/** Request
	 *	
	 *	@param {String} method
	 *	@param {String} type				Response type
	 *	@param {String} url
	 *	@param {Object} header
	 *	@param {String} data
	 *	@param {Function} callbackHandler
	 */
	static Request( method, type, url, header, data, callbackHandler ) {
		
		let xhr = new XMLHttpRequest();
			xhr.responseType = type || "text";
			xhr.onreadystatechange = function() {
			
				if( xhr.readyState === XMLHttpRequest.DONE ) {
					
					callbackHandler( xhr.response, xhr );
					
				/*	switch( xhr.status ) {
						
						case 200:
						case 401:
							if( callbackHandler instanceof Function )
								callbackHandler( xhr.response, xhr );
							break;
						
						default:
							if( callbackHandler instanceof Function )
								callbackHandler( null );
							break;
							
					}
				/**/
				
				}
				
			};
		
		///
		xhr.open( method, url, true );
		
		///
		for( let key in header )
			xhr.setRequestHeader( key, header[key] );
		
		///
		if( data && typeof data != "string" )
			data = JSON.stringify( data );
		
		xhr.send( data );

	}
	
}
