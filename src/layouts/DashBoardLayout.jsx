import { AiOutlineHome, AiOutlineProfile } from 'react-icons/ai';
import { BiPackage } from 'react-icons/bi';
import { RiHistoryLine } from 'react-icons/ri';
import { MdOutlineTrackChanges } from 'react-icons/md';
import { NavLink, Outlet } from 'react-router-dom';
import ZapShiftLogo from '../Pages/shared/ZapShiftLogo/ZapShiftLogo';

const DashBoardLayout = () => {
    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">

                    {/* Navbar */}
                    <div className="navbar bg-base-300 w-full lg:hidden">
                        <div className="flex-none lg:hidden">
                            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-6 w-6 stroke-current"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </label>
                        </div>
                        <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
                    </div>
                    {/* Page content here */}
                    <Outlet></Outlet>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 min-h-full w-80 dash">
                        {/* Sidebar content here */}
                        <li><ZapShiftLogo className={'mb-3.5'} /></li>
                        <li>
                            <NavLink to='/'>
                                <AiOutlineHome className="mr-2 text-xl" /> Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/myParcels'>
                                <BiPackage className="mr-2 text-xl" /> My Parcels
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/paymentHistory'>
                                <RiHistoryLine className="mr-2 text-xl" /> Payment History
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/track'>
                                <MdOutlineTrackChanges className="mr-2 text-xl" /> Track a Parcel
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/profile'>
                                <AiOutlineProfile className="mr-2 text-xl" /> Update Profile
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default DashBoardLayout;