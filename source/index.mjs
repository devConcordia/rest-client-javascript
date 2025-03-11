
import Basic from './auth/Basic.mjs';
import Bearer from './auth/Bearer.mjs';
import JsonWebToken from './auth/JsonWebToken.mjs';

import RestClient from './RestClient.mjs';

///
const auth = { Basic, Bearer, JsonWebToken };

export default { auth, RestClient }
