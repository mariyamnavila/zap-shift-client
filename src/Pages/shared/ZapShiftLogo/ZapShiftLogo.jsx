import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';

const ZapShiftLogo = ({ className }) => {
  return (
    <Link to={'/'}>
      <div className='mx-auto'>
        <div className={`flex items-end mr-3 ${className}`}>
          <img className='mb-2' src={logo} alt="" />
          <p className='text-3xl -ml-3 font-extrabold'>ZapShift</p>
        </div>
      </div>
    </Link>
  );
};

export default ZapShiftLogo;