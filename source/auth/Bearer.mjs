
import {
	base64_encode
} from '../util/common.mjs';

/** Bearer
 *	
 *	
 */
export default class Bearer {
	
	constructor( token ) {
		
		this.token = token;
		
	}
	
	/** getAuthorization
	 *	
	 *	@return {String}
	 */
	getAuthorization() {
		
		return "Bearer "+ base64_encode( this.token );
		
	}
	
}