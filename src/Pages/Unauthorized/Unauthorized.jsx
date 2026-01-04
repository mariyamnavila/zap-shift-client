import { Link } from "react-router-dom";

const Unauthorized = () => (

    <div className="h-screen flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="text-gray-500 mt-2">
                You don’t have permission to view this page.
            </p>
            <Link to="/" className="btn btn-primary mt-4">
                Go Home
            </Link>
        </div>
    </div>
);
export default Unauthorized;