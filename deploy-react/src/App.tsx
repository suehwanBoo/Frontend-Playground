import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BaseScreen from "./feature/screen/BaseScreen";
import Home from "./feature/home/Home";
import ErrorPage from "./feature/error/ErrorPage";
import FuncPage from "./feature/func/FuncPage";
import ToolkitPage from "./feature/toolkit/ToolkitPage";
import AboutPage from "./feature/about/AboutPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={provider} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
