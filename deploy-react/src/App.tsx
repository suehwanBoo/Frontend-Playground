import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BaseScreen from "./feature/common/BaseScreen";

const provider = createBrowserRouter([
  {
    path: "/",
    element: <BaseScreen />,
  },
]);

function App() {
  return <RouterProvider router={provider} />;
}

export default App;
