
import { base64_encode, json_encode } from "./util/common.mjs";
import { hash } from "./util/security.mjs";

import Http from "./util/Http.mjs";

/** RestClient
 *	
 */
export default class RestClient {
	
	/** RestClient
	 *	
	 *	@param {String} url
	 *	@param {String} type			Default: JSON
	 */
	constructor( url, type ) {
		
		this.url = url;
		
		this.type = type || Http.JSON;
		this.auth = null;
		
	}
	
	setAuth( auth ) {
		
		this.auth = auth || null;
		
	}
	
	/** request
	 *	
	 *	@param {String} method		GET | POST | PUT | DELETE
	 *	@param {String} path
	 *	@param {String} data
	 *	@param {Function} callbackHandler
	 */
	request( method, path, data, callbackHandler ) {
		
		let header = new Object;
		
		if( this.type == Http.JSON )
			header['Content-Type'] = 'application/json';
		
		if( this.auth )
			header["Authorization"] = this.auth.getAuthorization();
		
		///
		let uri = (this.url +'/'+ path).replace(/([^:])\/{2,}/g, '$1/');
		
		///
		Http.Request( method, this.type, uri, header, data, callbackHandler );
		
	}
	
	get( path, callbackHandler ) {
		
		this.request( Http.GET, path, null, callbackHandler );
		
	}
	
	post( path, data, callbackHandler ) {
		
		this.request( Http.POST, path, data, callbackHandler );
		
	}
	
	put( path, data, callbackHandler ) {
		
		this.request( Http.PUT, path, data, callbackHandler );
		
	}
	
	patch( path, data, callbackHandler ) {
		
		this.request( Http.PATCH, path, data, callbackHandler );
		
	}
	
	delete( path, callbackHandler ) {
		
		this.request( Http.DELETE, path, null, callbackHandler );
		
	}
	
}

