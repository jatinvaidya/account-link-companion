import { useSearchParams } from "react-router-dom";
import decode from "jwt-decode";
import Redirect from "./Redirect";
import { useEffect } from "react";

const Processor = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	useEffect(() => {
		localStorage.setItem("redirectState", searchParams.get("state"));
		localStorage.setItem("auth0Domain", decodedJwt.host);
	});

	// TBD: actually verify JWT signature & expiry etc. before consuming //
	// in fact there is no need to send this JWT since all these params can be easily read from a .env file.
	// The JWT arguably adds some security in the sense that now this application can be invoked only with a valid JWT.
	const decodedJwt = decode(searchParams.get("jwt"));
	const generateAuthorizationRequest = (decodedJwt) => {
		const authorizationRequest = require("url").format({
			protocol: "https",
			hostname: decodedJwt.host,
			pathname: decodedJwt.path,
			query: decodedJwt.query,
		});
		return authorizationRequest;
	};

	return <Redirect url={generateAuthorizationRequest(decodedJwt)} />;
};

export default Processor;
