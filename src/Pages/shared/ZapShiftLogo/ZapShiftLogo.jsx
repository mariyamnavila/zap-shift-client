import logo from '../../../assets/logo.png';

const ZapShiftLogo = () => {
  return (
    <div className='mx-auto'>
      <div className='flex items-end justify-center mr-3'>
        <img className='mb-2' src={logo} alt="" />
        <p className='text-3xl -ml-3 font-extrabold'>ZapShift</p>
      </div>
    </div>
  );
};

export default ZapShiftLogo;