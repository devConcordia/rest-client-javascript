


/** base64_encode
 *	
 *	@param {String} input
 *	@return {String}
 */
const base64_encode = btoa;

/** base64_decode
 *	
 *	@param {String} input
 *	@return {String}
 */
const base64_decode = atob;

/** json_encode
 *	
 *	@param {Object} input
 *	@return {String}
 */
const json_encode = JSON.stringify;

/** json_decode
 *	
 *	@param {String} input
 *	@return {Object}
 */
const json_decode = JSON.parse;

/** base64url_encode
 *	
 *	@param {String} input
 *	@return {String}
 */
function base64url_encode( input ) {
	
	let output = base64_encode( input );
	
	output = output.replace(/[\+]/gm, '-');
	output = output.replace(/[\/]/gm, '_');
	output = output.replace(/[\=]/gm, '');
	
	return output;
	
}

/** base64url_decode
 *	
 *	@param {String} input
 *	@return {String}
 */
function base64url_decode( input ) {
	
	input = input.replace(/[-]/gm, '+');
	input = input.replace(/[_]/gm, '/');
	
	return base64_decode( input );
	
}

function bytes_to_hex( bytes ) {
	
	return forge.util.bytesToHex( bytes );
	
}

function hex_to_bytes( hex ) {
	
	return forge.util.hexToBytes( hex );
	
}

export {
	
	bytes_to_hex,
	hex_to_bytes,
	
	base64_encode,
	base64_decode,
	
	base64url_encode,
	base64url_decode,
	
	json_encode,
	json_decode
	
}
