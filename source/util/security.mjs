
/** hash
 *	
 *	@param {String} type		md5 | sha1 | sha256 | sha384 | sha512
 *	@param {String} data
 *	@return {String}
 */
function hash( type, data ) {
	
	let md = forge.md[ type ];
	
	if( !md )
		throw 'hash type "'+ type +'" not implemented';
	
	return md.create().update( data ).digest().getBytes();
	
}


/** hmac
 *	
 *	@ref https://tools.ietf.org/html/rfc2104
 *	@ref https://pt.wikipedia.org/wiki/HMAC
 *	
 *	@param {String} type		md5 | sha1 | sha256 | sha384 | sha512
 *	@param {String} secret
 *	@param {String} data
 *	@return {String}
 */
function hmac( type, secret, data ) {
	
	let hm = forge.hmac.create();
		hm.start( type, secret );
		hm.update( data );
		
	return hm.digest().getBytes();
	
}


const PEM_BEGIN_PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----";
const PEM_END_PRIVATE_KEY = "-----END RSA PRIVATE KEY-----";

const PEM_BEGIN_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----";
const PEM_END_PUBLIC_KEY = "-----END PUBLIC KEY-----";

/** rsa_private_load
 *	
 *	@param {Number} bits
 *	@return {Object}	{ privateKey, publicKey }
 */
function rsa_create( bits = 2048 ) { return forge.pki.rsa.generateKeyPair({ bits, e: 0x10001 }) }

function rsa_private_pem( key, pem = false ) {
	
	let output = forge.pki.privateKeyToPem( key );
	
	if( !pem ) {
		
		output = output.replace(/[\r\n]/gim, '');
		output = output.replace( PEM_BEGIN_PRIVATE_KEY, '');
		output = output.replace( PEM_END_PRIVATE_KEY, '');
	
	}
	
	return output;
	
}

function rsa_public_pem( key, pem = false ) {
	
	let output = forge.pki.publicKeyToPem( key );

	if( !pem ) {

		output = output.replace(/[\r\n]/gim, '');
		output = output.replace( PEM_BEGIN_PUBLIC_KEY, '');
		output = output.replace( PEM_END_PUBLIC_KEY, '');
	
	}
	
	return output;
	
}

function rsa_sign( mode, key, content ) {
	
	let md = forge.md[ mode ].create();
		md.update( content );

	return key.sign( md );
	
}

/** rsa_private_load
 *	
 *	@param {String} input
 *	@return {Object}
 */
function rsa_private_load( input ) { return forge.pki.privateKeyFromPem( PEM_BEGIN_PRIVATE_KEY +'\n'+ input +'\n'+ PEM_END_PRIVATE_KEY ) }

/** rsa_public_load
 *	
 *	@param {String} input
 *	@return {Object}
 */
function rsa_public_load( input ) { return forge.pki.publicKeyFromPem( PEM_BEGIN_PUBLIC_KEY +'\n'+ input +'\n'+ PEM_END_PUBLIC_KEY ) }

/** rsa_private_encrypt
 *	
 *	@param {Object} key
 *	@param {String} data
 *	@return {String}
 */
function rsa_private_encrypt( key, data ) { return forge.pki.rsa.encrypt( data, key, 0x01 ) }

/** rsa_private_decrypt
 *	
 *	@param {Object} key
 *	@param {String} data
 *	@return {String}
 */
function rsa_private_decrypt( key, data ) { return key.decrypt( data ) }

/** rsa_public_encrypt
 *	
 *	@param {Object} key
 *	@param {String} data
 *	@return {String}
 */
function rsa_public_encrypt( key, data ) { return  forge.pki.rsa.encrypt( data, key, 0x02 ) }

/** rsa_public_decrypt
 *	
 *	@param {Object} key
 *	@param {String} data
 *	@return {String}
 */
function rsa_public_decrypt( key, data ) { return forge.pki.rsa.decrypt( data, key, 0x02 ) }

/* */

/** bytes_random | create_salt
 *	
 *	@param {Number} length
 *	@return {String}
 */
function bytes_random( length = 8 ) {
	
	let output = "";
	
	for( let i = 0; i < length; i++ ) 
		output += String.fromCharCode( Math.floor(Math.random() * 256) );
	
	return output;
	
}

/** evp_kdf
 *	
 *	@param {String} secret
 *	@param {String} salt
 *	@param {Number} keySize = 8
 *	@param {Number} ivSize = 4
 *	@param {Number} iterations = 1
 *	@param {String} hashAlgorithm = md5			md5 | sha1 | sha256 | sha384 | sha512
 *	@return {String}
 */
function evp_kdf( secret, salt, keySize = 8, ivSize = 4, iterations = 1, algo = "md5" ) {
	
	let md = forge.md[ algo ];
	
	let size = keySize + ivSize;
	let bytes  = "";

	let countWords = 0;
	
	let block = null;
	let hasher = md.create();

	while( countWords < size ) {
		
		if( block != null ) hasher.update( block );
		
		hasher.update( secret );
		hasher.update( salt );

		block = hasher.digest().getBytes();
		
		hasher = md.create();

		for( let i = 1; i < iterations; i++ ) {
			
			hasher.update( block );
			
			block = hasher.digest().getBytes();
			hasher = md.create();
			
		}

		bytes += block.substring( 0, Math.min( block.length, (size - countWords) * 4 ) );

		countWords += block.length/4;
	
	}
	
	let k = keySize * 4;
	
	return {
		"key": bytes.substring( 0, k ),
		"iv" : bytes.substring( k, k + ivSize * 4 )
	}
	
}

/* */

/** aes_encrypt
 *	
 *	
 *	@param {String} data
 *	@param {String} secret
 *	@param {String} mode		ECB | CFB | OFB | CTR | GCM
 *	@return {String}
 */
function aes_encrypt( input, secret, mode = 'ECB' ) {
	
	mode = 'AES-'+ mode.toUpperCase();
	
	let salt = bytes_random( 8 );
	let { key, iv } = evp_kdf( secret, salt, 8, 4 );

	var cipher = forge.cipher.createCipher( mode, key );
	
	cipher.start({ iv });
	cipher.update( forge.util.createBuffer(input) );
	cipher.finish();
	
	return salt + cipher.output.getBytes();
	
}

/** aes_decrypt
 *	
 *	("0123456789").substring(0,8)
 *	
 *	@param {String} data
 *	@param {String} secret
 *	@param {String} mode		ECB | CFB | OFB | CTR | GCM
 *	@return {String}
 */
function aes_decrypt( input, secret, mode = 'ECB' ) {
	
//	input = base64_decode( input );
	
	mode = 'AES-'+ mode.toUpperCase();
	
	let salt = input.substring( 0, 8 );
	let data = input.substring( 8 );
	
	let { key, iv } = evp_kdf( secret, salt, 8, 4 );
	
	let decipher = forge.cipher.createDecipher( mode, key );
	
	decipher.start({ iv });
	decipher.update( forge.util.createBuffer(data) );
	decipher.finish();
	
	return decipher.output.getBytes();
	
}


export {
	
	hash,
	hmac,
	
	aes_encrypt,
	aes_decrypt,
	
	rsa_create,
	rsa_sign,
	
	rsa_private_pem,
	rsa_private_load,
	rsa_private_encrypt,
	rsa_private_decrypt,
	
	rsa_public_pem,
	rsa_public_load,
	rsa_public_encrypt,
	rsa_public_decrypt
	
};


