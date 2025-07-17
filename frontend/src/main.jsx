import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<UserProvider>
			<>
				<App />
				<Toaster position="top-right" reverseOrder={false} />
			</>
		</UserProvider>
	</BrowserRouter>
);
