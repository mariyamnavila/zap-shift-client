import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import useAxios from "../../../hooks/useAxios";
import Swal from "sweetalert2";


const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { createUser, updateUserProfile } = useAuth()
    const [image, setImage] = useState(null)

    const axiosInstance = useAxios();

    const location = useLocation()
    const navigate = useNavigate()
    const from = location.state?.from || '/'

    const onSubmit = (data) => {
        // console.log(data);
        const { email, password, name } = data
        createUser(email, password)
            .then( async (result) => {
                // console.log(result.user);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'User Created Successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate(from)

                // update user profile in database

                const userInfo = {
                    email: email,
                    role: 'user',
                    createdAt: new Date().toISOString(),
                    lastLogIn: new Date().toISOString(),
                    name: name,
                }

                const userRes = await axiosInstance.post('/users', userInfo);
                // console.log(userRes.data);

                // update user profile in firebase
                const profile = {
                    displayName: name,
                    photoURL: image
                }
                updateUserProfile(profile)
                    .then(() => {
                        // console.log('doneeee');
                    })
                    .catch((error) => {
                        // console.log(error);
                    })
            })
            .catch((error) => {
                // console.log(error);
            })
    }

    const handleImageUpload = async (event) => {
        const formData = new FormData();
        const imageFile = event.target.files[0];
        formData.append('image', imageFile);
        // console.log(event.target.files[0]);
        // You can implement the image upload logic here

        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imagebb_key}`, formData)
        setImage(res.data.data.url);
    }

    return (
        <div>
            <div className="card w-full max-w-sm shrink-0">
                <div className="card-body">
                    <h1 className="text-5xl font-bold">Create Account!</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <fieldset className="fieldset">
                            <label className="label">Name</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Name"
                                {...register('name', {
                                    required: true
                                })}
                            />
                            {
                                errors.name?.type === 'required' && <p className="text-red-500">Name is required</p>
                            }
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="file-input"
                                placeholder="Profile Image"
                            />
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
                            <button className="btn btn-primary text-black mt-2">Register</button>
                            <div>Already Have An Account? <a href="/login" className="link link-hover text-accent font-bold">Login</a></div>
                        </fieldset>
                    </form>
                    <SocialLogin></SocialLogin>
                </div>
            </div>
        </div>
    );
};

export default Register;