import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BaseScreen from "./feature/screen/BaseScreen";
import Home from "./feature/home/Home";
import ErrorPage from "./feature/error/ErrorPage";

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
    ],
  },
]);

function App() {
  return <RouterProvider router={provider} />;
}

export default App;
