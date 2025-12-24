import { useForm } from "react-hook-form";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";


const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { signIn } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const from = location.state?.from || '/'

    const onSubmit = (data) => {
        console.log(data);
        const { email, password } = data;
        signIn(email, password)
            .then((result) => {
                console.log(result.user);
                toast.success('You have successfully logged in ', {
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
                navigate(from)
            })
            .catch((error) => {
                console.log(error);
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
        <div className="card w-full max-w-sm shrink-0">
            <div className="card-body">
                <h1 className="text-5xl font-bold my-3">Login Now!</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            className="input"
                            placeholder="Email"
                            {...register('email', {
                                required: true
                            })}
                        />
                        {
                            errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>
                        }

                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="Password"
                            {...register('password', {
                                required: true,
                                minLength: 6,
                            })}
                        />

                        {
                            errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>
                        }
                        {
                            errors.password?.type === 'minLength' && <p className="text-red-500">Password must be 6 characters or longer</p>
                        }
                        <div><a className="link link-hover">Forgot password?</a></div>

                        <button className="btn btn-primary text-black mt-2">Login</button>
                        <div>Don't Have Any Account? <a href="/register" className="link link-hover text-primary font-bold">Register</a></div>
                    </fieldset>
                </form>
                <SocialLogin></SocialLogin>
            </div>
        </div>
    );
};

export default Login;