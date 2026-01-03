import {
  createBrowserRouter,
} from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import PrivateRoute from '../routes/PrivateRoute';
import DashBoardLayout from "../layouts/DashBoardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../Pages/BeARider/BeARider";
import Loading from "../Pages/shared/Loading/Loading";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'coverage',
        Component: Coverage,
        loader: () => fetch('./warehouses.json'),
      },
      {
        path: 'sendParcel',
        element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>,
        loader: () => fetch('./warehouses.json'),
      },
      {
        path: 'beARider',
        element: <PrivateRoute><BeARider></BeARider></PrivateRoute>,
        loader: () => fetch('./warehouses.json'),
        hydrateFallbackElement: <Loading/>,
      },
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute>
      <DashBoardLayout></DashBoardLayout>
    </PrivateRoute>,
    children:[
      {
        path:'myParcels',
        Component: MyParcels,
      },
      {
        path:'payment/:parcelId',
        Component: Payment,
      },
      {
        path:'paymentHistory',
        Component: PaymentHistory,
      },
      {
        path:'pendingRiders',
        Component: PendingRiders,
      },
      {
        path: "track/:trackingNumber?",
        Component: TrackParcel,
      },
    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      },
    ]
  },
]);