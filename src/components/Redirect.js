import { useEffect } from "react";

const Redirect = ({ url }) => {
	useEffect(() => {
		window.location.href = url;
	});
	return null;
};

export default Redirect;
