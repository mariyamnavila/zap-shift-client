import { useForm } from "react-hook-form";


const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <div>
            <div className="card w-full max-w-sm shrink-0">
                <div className="card-body">
                    <h1 className="text-5xl font-bold">Create an Account!</h1>
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
                            <div>Already Have An Account? <a href="/login" className="link link-hover text-[#CAEB66] font-bold">Login</a></div>
                            <button className="btn btn-neutral mt-4">Register</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;