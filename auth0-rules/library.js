function library(user, context, callback) {
	const createJwt = (issuer, audience, signingSecret, payload) => {
		const options = {
			expiresInMinutes: 5,
			audience: audience,
			issuer: issuer,
		};
		return jwt.sign(payload, signingSecret, options);
	};

	const prepareReauthorizationJwt = () => {
		const payload = {
			host: auth0.domain,
			path: "/authorize",
			sub: user.user_id,
			email: user.email,
			query: {
				...context.request.query,
				client_id: configuration.COMPANION_CLIENT_ID,
				redirect_uri: `${configuration.COMPANION_URL}/callback`,
			},
		};

		return createJwt(
			configuration.COMPANION_JWT_ISSUER,
			configuration.COMPANION_JWT_AUDIENCE,
			configuration.COMPANION_JWT_SECRET,
			payload
		);
	};

	const linkUserIdentity = async (idToken) => {
		var ManagementClient = require("auth0@2.39.0").ManagementClient;
		var management = new ManagementClient({
			token: auth0.accessToken,
			domain: auth0.domain,
		});
		var decodedIdToken = verifyIdToken(idToken);
		var params = {
			user_id: user.user_id, //secondary user_id
			provider: user.identities[0].provider,
		};

		await management
			.linkUsers(decodedIdToken.sub, params)
			.then((user) => {
				console.log(`users linked`);
				context.primaryUser = decodedIdToken.sub;
			})
			.catch((error) => console.error(`oops: ${error}`));
	};

	const verifyIdToken = (token) => {
		// Verify using getKey callback
		// Example uses https://github.com/auth0/node-jwks-rsa as a way to fetch the keys.
		var jwksClient = require("jwks-rsa@2.0.4");
		var client = jwksClient({
			jwksUri: `https://${auth0.domain}/.well-known/jwks.json`,
		});
		function getKey(header, cbk) {
			client.getSigningKey(header.kid, function (err, key) {
				var signingKey = key.publicKey || key.rsaPublicKey;
				console.log(`signingKey: ${signingKey}`);
				cbk(null, signingKey);
			});
		}
		const jwt = require("jsonwebtoken@8.5.0");
		console.log(`verifying IdToken`);
		/*jwt.verify(token, getKey, {}, function(err, decoded) {
        console.log(`err: ${err}`);
          console.log(`decoded.sub: ${decoded}`);
        return decoded;
      });*/
		return jwt.decode(token);
	};

	const isRedirectCallback = () => {
		return context.protocol === "redirect-callback";
	};

	const mustLinkAccountBeforeLogin = () => {
		// for SingPass, this predicate would be:
		// return isEmpty(reverse_linkpass_uid);
		user.app_metadada = user.app_metadata || {};
		return !!user.app_metadata.link_me && user.identities.length === 1;
	};

	const redirectToCompanion = (jwt) => {
		context.redirect = {
			url: `https://${configuration.COMPANION_HOST}/processor?jwt=${jwt}`,
		};
	};

	global.prepareReauthorizationJwt = prepareReauthorizationJwt;
	global.verifyIdToken = verifyIdToken;
	global.linkUserIdentity = linkUserIdentity;
	global.isRedirectCallback = isRedirectCallback;
	global.mustLinkAccountBeforeLogin = mustLinkAccountBeforeLogin;
	global.redirectToCompanion = redirectToCompanion;
	return callback(null, user, context);
}
