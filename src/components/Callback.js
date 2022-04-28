import { useEffect } from "react";
import { useRef } from "react";

const Callback = () => {
	const formRef = useRef(null);
	const hashParams = new URLSearchParams(window.location.hash);
	const redirectState = localStorage.getItem("redirectState");
	const actionUrl = `https://${localStorage.getItem(
		"auth0Domain"
	)}/continue?state=${redirectState}`;
	const idToken = hashParams.get("id_token");

	useEffect(() => {
		// auto submit form after loading this component
		formRef.current.submit();
	}, []);

	return (
		<form ref={formRef} method="POST" action={actionUrl}>
			<input type="hidden" name="id_token" value={idToken}></input>
		</form>
	);
};

export default Callback;
