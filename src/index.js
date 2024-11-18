import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './Login';
import Dashboard from './pages/Dashboard';
import TambahRPOJK from './pages/TambahRPOJK';
import TambahResponse from './pages/TambahResponse';
import reportWebVitals from './reportWebVitals';
import AdminByInstansi from './pages/AdminByInstansi'
import AdminByBaris from './pages/AdminByBaris'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "rpojk/tambah",
        element: <TambahRPOJK />,
      },
      {
        path: "rpojk/tambah/:id",
        element: <TambahRPOJK />,
      },
      {
        path: "response/:id",
        element: <TambahResponse />,
      },
      {
        path: "instansi/:id",
        element: <AdminByInstansi />,
      },
      {
        path: "baris/:id",
        element: <AdminByBaris />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <App />
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
