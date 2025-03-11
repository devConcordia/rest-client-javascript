
import {
	json_encode,
	base64_encode,
	base64url_encode
} from '../util/common.mjs';

import {
	hmac,
	rsa_sign,
	rsa_private_load
} from '../util/security.mjs';


/** JsonWebToken
 *
 *	@ref https://www.rfc-editor.org/rfc/rfc7519	JWT
 *	@ref https://www.rfc-editor.org/rfc/rfc7515	JWS
 *	@ref https://www.rfc-editor.org/rfc/rfc7518	JWA
 *	
 */
export default class JsonWebToken {
	
	///	list of implemented algorithms
	static HS256 = 'HS256';
	static HS384 = 'HS384';
	static HS512 = 'HS512';
	
	static RS256 = 'RS256';
	static RS384 = 'RS384';
	static RS512 = 'RS512';

	constructor( header, payload, key ) {
		
		///
		this.header = header;
		this.payload = payload;
		
		///
		if( header.alg.slice(0,2) == 'RS' )
			if( typeof key == 'string' )
				key = rsa_private_load( key );
		
		///
		this.key = key;
		
	}
	
	/** getAuthorization
	 *	
	 *	@return {String}
	 */
	getAuthorization() {
		
		return "Bearer "+ base64_encode( this.getToken() );
		
	}
	
	/** update
	 *	
	 *	@param {Number} delay		in milliseconds
	 */
	update( delay = 30000 ) {
		
		let T = Date.now();
		
		let payload = this.payload;
		
		/// atualiza se menor que 5 segundos
		if( (payload.exp - T) < 5000 ) {
			payload.iat = T;
			payload.exp = T + delay;
		}
		
	}
	
	/** getToken
	 *	
	 *	@return {String}
	 */
	getToken() { 
		
		/// 
		this.update();
		
		///
		let key = this.key;
		
		///
		let header = base64url_encode( json_encode( this.header ) );
		let payload = base64url_encode( json_encode( this.payload ) );
		
		///
		let content = header +'.'+ payload;
		
		let signature = "";
		
		let alg = this.header.alg;
		let size = Number( alg.slice(-3) );
		let type = 'sha'+ size;
		
		////
		switch( alg.slice(0,2) ) {
			
			case 'HS':
				signature = base64url_encode( hmac( type, key, content ) );
				break;
		
			case 'RS':
				
				if( typeof key == 'string' )
					key = rsa_private_load( key );
				
				signature = base64url_encode( rsa_sign( type, key, content ) );
				
				break;
			
			default:
				throw new Error("JsonWebToken: "+ alg +" not implemented");
				break;
			
		}
		
		return content +'.'+ signature;
		
	}
	
	/** Header
	 *	
	 */
	static Header( alg, kid ) {
		
		let output = new Object();
			output.typ = "JWT";
		
		if( alg ) output.alg = alg;
		if( kid ) output.kid = kid;
		
		///
		return output;
		
	}
	
	/** Payload
	 *	
	 */
	static Payload( iss, sub, nbf ) {
		
		let output = new Object();
			output.exp = Date.now() + 3000;
			output.iat = Date.now();
		
		/// (issuer) Define quem emitiu o token (geralmente um serviço ou servidor de autenticação)
		if( iss ) output.iss = iss;
		
		/// (subject) A identificação do principal (usuário ou entidade) a quem o token se refere.
		if( sub ) output.sub = sub;
		
		/// (not before) Define o momento a partir do qual o token é válido.
		if( nbf ) output.nbf = nbf;
		
		///
		return output;
		
	}
	
	static Create( key, alg ) {
		
		return new JsonWebToken(
			JsonWebToken.Header( alg ),
			JsonWebToken.Payload(),
			key
		)
		
	}
	
}
