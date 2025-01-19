import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BaseScreen from "./feature/screen/BaseScreen";
import ErrorPage from "./feature/error/ErrorPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { protectRouter } from "./utils/protect";
import { lazy } from "react";

const HomePage = lazy(() => import("./feature/home/Home"));
const FuncPage = lazy(() => import("./feature/func/FuncPage"));
const ToolkitPage = lazy(() => import("./feature/toolkit/ToolkitPage"));
const AboutPage = lazy(() => import("./feature/about/AboutPage"));
const PostPage = lazy(() => import("./feature/post/PostPage"));
const provider = createBrowserRouter([
  {
    path: "/",
    element: <BaseScreen />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
      {
        path: "/post",
        element: <PostPage />,
        loader: protectRouter,
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
