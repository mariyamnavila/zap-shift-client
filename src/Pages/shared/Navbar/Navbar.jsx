import { Link, NavLink } from "react-router-dom";
import ZapShiftLogo from "../ZapShiftLogo/ZapShiftLogo";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";

const Navbar = () => {
    const { user, logOut } = useAuth()

    const navItems = <>
        <li><NavLink to={'/'}>Home</NavLink></li>
        <li><NavLink to={'/sendParcel'}>Send A Parcel</NavLink></li>
        <li><NavLink to={'/coverage'}>Coverage</NavLink></li>
        <li><NavLink to={'/about'}>About</NavLink></li>
        {
            user ?
                <>
                    <li><NavLink to={'/dashboard'}>Dashboard</NavLink></li>
                </>
                :
                <></>
        }
    </>

    const handleLogOut = () => {
        logOut()
            .then(() => {
                toast.error('you logged Out ', {
                    zIndex: 9999,
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    // transition: Bounce,
                })
            })
            .catch((error) => {
                toast.error(error, {
                    zIndex: 9999,
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    // transition: Bounce,
                });
            })
    }


    return (
        <div className="navbar bg-base-100 mt-5 rounded-xl mx-auto max-w-7xl shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {
                            navItems
                        }
                    </ul>
                </div>
                <div className="btn btn-ghost text-xl">
                    <ZapShiftLogo></ZapShiftLogo>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 links">
                    {
                        navItems
                    }
                </ul>
            </div>
            <div className="navbar-end">
                {
                    user
                        ? <button onClick={handleLogOut} className="btn btn-primary hover:bg-[#1d553c] hover:border-[#1d553c] hover:text-white border text-black rounded-xl">Log Out</button>
                        : <Link to={'/login'} className="btn btn-primary hover:bg-[#1d553c] hover:border-[#1d553c] hover:text-white border text-black rounded-xl">Login</Link>
                }
            </div>
        </div>
    );
};

export default Navbar;