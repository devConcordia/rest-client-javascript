
import {
	base64_encode
} from '../util/common.mjs';

/** Basic
 *	
 *	@ref https://www.rfc-editor.org/rfc/rfc9110.html#name-http-authentication
 *	@ref https://www.rfc-editor.org/rfc/rfc7617.html#section-2
 *	
 */
export default class Basic {
	
	constructor( username, passphrase ) {
		
		this.username = username;
		this.passphrase = passphrase;
		
	}
	
	/** getAuthorization
	 *	
	 *	@return {String}
	 */
	getAuthorization() {
		
		return "Basic "+ base64_encode( this.username +':'+ this.passphrase );
		
	}
	
}