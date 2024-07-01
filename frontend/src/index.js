import ReactDOM from "react-dom/client";
import "./index.css";
import router from "./Routes/PageRoutes";
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
);
