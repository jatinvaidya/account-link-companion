import { BrowserRouter, Route, Routes } from "react-router-dom";
import Processor from "./components/Processor";
import Callback from "./components/Callback";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/processor" element={<Processor />} />
				<Route path="/callback" element={<Callback />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
