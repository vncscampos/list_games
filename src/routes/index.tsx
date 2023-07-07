import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "../pages/Home/Home";
import Auth from "../pages/Auth/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

function Routes() {
    return (
      <>
        <RouterProvider router={router} />
      </>
    );
  }

export default Routes;
