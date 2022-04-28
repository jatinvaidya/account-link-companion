import { useSearchParams } from "react-router-dom";
import decode from "jwt-decode";
import Redirect from "./Redirect";
import { useEffect } from "react";

const Processor = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	useEffect(() => {
		// storing input name
		localStorage.setItem("redirectState", searchParams.get("state"));
		localStorage.setItem("auth0Domain", decodedJwt.host);
	});

	// TBD: actually verify JWT signature etc. before consuming //
	const decodedJwt = decode(searchParams.get("jwt"));
	const currentLocation = `${window.location.protocol}//${window.location.host}`;
	const generateAuthorizationRequest = (decodedJwt) => {
		const authorizationRequest = require("url").format({
			protocol: "https",
			hostname: decodedJwt.host,
			pathname: decodedJwt.path,
			query: {
				...decodedJwt.query,
				redirect_uri: `${currentLocation}/callback`,
			},
		});
		return authorizationRequest;
	};

	return <Redirect url={generateAuthorizationRequest(decodedJwt)} />;
};

export default Processor;
