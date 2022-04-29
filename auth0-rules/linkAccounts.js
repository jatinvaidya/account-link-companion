async function linkAccounts(user, context, callback) {
	user.app_metadata = user.app_metadata || {};
	if (global.mustLinkAccountBeforeLogin() && !global.isRedirectCallback()) {
		// simulating unverified SingPass identity
		// proceed to link social identity with DB identity
		// do not establish any matching based on email etc.
		// just link to the DB identity user authenticates with.
		const jwt = global.prepareReauthorizationJwt();
		global.redirectToCompanion(jwt);
	} else if (global.isRedirectCallback()) {
		// resume original authorization request
		context.request.body = context.request.body || {};
		let idToken = context.request.body.id_token;
		if (!!idToken) {
			await global.linkUserIdentity(idToken);
		} else {
			return callback(
				new AuthorizationError(
					"Account Linking Failed: Missing id_token of Primary Account"
				)
			);
		}
	}
	return callback(null, user, context);
}
