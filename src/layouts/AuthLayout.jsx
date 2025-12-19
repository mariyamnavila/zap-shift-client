import { Outlet } from "react-router-dom";
import authImg from '../assets/authImage.png';
import ZapShiftLogo from "../Pages/shared/ZapShiftLogo/ZapShiftLogo";

const AuthLayout = () => {
    return (
        <div className="bg-base-200">
            <div className="max-w-7xl mx-auto">
                <ZapShiftLogo className={'p-12'} />
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="flex-1 items-center bg-[#CAEB66]/20">
                        <img
                            src={authImg}
                            className="mx-auto "
                        />
                    </div>
                    <div className="flex-1">
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;