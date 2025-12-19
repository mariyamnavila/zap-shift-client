import { useForm } from "react-hook-form";


const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <div>
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

                </fieldset>
                <button className="btn btn-neutral mt-4">Login</button>
            </form>
        </div>
    );
};

export default Login;