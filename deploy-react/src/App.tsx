import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BaseScreen from "./feature/screen/BaseScreen";
import Home from "./feature/home/Home";
import ErrorPage from "./feature/error/ErrorPage";
import FuncPage from "./feature/func/FuncPage";
import ToolkitPage from "./feature/toolkit/ToolkitPage";
import AboutPage from "./feature/about/AboutPage";

const provider = createBrowserRouter([
  {
    path: "/",
    element: <BaseScreen />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/func",
        element: <FuncPage />,
      },
      {
        path: "/toolkit",
        element: <ToolkitPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={provider} />;
}

export default App;
