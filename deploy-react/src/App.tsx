import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BaseScreen from "./feature/screen/BaseScreen";
import Home from "./feature/home/Home";

const provider = createBrowserRouter([
  {
    path: "/",
    element: <BaseScreen />,
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
