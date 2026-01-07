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
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin";
import Unauthorized from "../Pages/Unauthorized/Unauthorized";
import AdminRoute from "../routes/AdminRoute";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";
import PendingDeliveries from "../Pages/Dashboard/PendingDeliveries/PendingDeliveries";
import RiderRoute from "../routes/RiderRoute";

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
        path: 'unauthorized',
        Component: Unauthorized,
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
      // Common routes
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
        path: "track/:trackingNumber?",
        Component: TrackParcel,
      },
      // Admin only routes
      {
        path:'pendingRiders',
        element: <AdminRoute><PendingRiders /></AdminRoute>,
      },
      {
        path:'activeRiders',
        element: <AdminRoute><ActiveRiders /></AdminRoute>,
      },
      {
        path:'assignRider',
        element: <AdminRoute><AssignRider /></AdminRoute>,
      },
      {
        path:'makeAdmin',
        element: <AdminRoute><MakeAdmin /></AdminRoute>,
      },
      // Rider only routes
      {
        path:'pendingDeliveries',
        element: <RiderRoute><PendingDeliveries /></RiderRoute>,
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