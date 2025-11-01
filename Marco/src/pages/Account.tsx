import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../app/store';
import { authService } from '../api/authService';
import { setCredentials } from '../auth/authSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ✅ Validation Schemas
const loginSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
});

const registerSchema = yup.object({
    username: yup.string().required('Username is required'),
    email: yup.string().email().required('Email is required'),
    password: yup.string().min(6).required('Password is required'),
});

export default function AccountPage() {
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(isLogin ? loginSchema : registerSchema),
    });

    // const toggleForm = () => {
    //     setIsLogin(!isLogin);
    //     reset();
    // };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        try {
            if (isLogin) {
                const res = await authService.login(data.email, data.password);
                dispatch(setCredentials({ user: res.user, token: res.access_token }));
                navigate('/');
            } else {
                await authService.register(data);
                alert('Registration successful! Please login.');
                setIsLogin(true);
                reset();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            alert(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <>
            <Navbar />
            <div className="account-page">
                <div className="container">
                    <div className="row">
                        <div className="col-2">
                            <img src="/images/logo.png" width="100%" alt="logo" />
                        </div>

                        <div className="col-2">
                            <div className="form-container">
                                <div className="form-btn">
                                    <span
                                        onClick={() => setIsLogin(true)}
                                        className={isLogin ? 'active' : ''}
                                    >
                                        Login
                                    </span>
                                    <span
                                        onClick={() => setIsLogin(false)}
                                        className={!isLogin ? 'active' : ''}
                                    >
                                        Register
                                    </span>
                                </div>

                                {/* FORM */}
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {!isLogin && (
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            {...register('username')}
                                        />
                                    )}
                                    {errors.username && (
                                        <small className="error">{errors.username.message}</small>
                                    )}

                                    {!isLogin && (
                                        <>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                {...register('username')}
                                            />
                                            {errors.username && (
                                                <small className="error">{errors.username.message}</small>
                                            )}
                                        </>
                                    )}

                                    <input
                                        type="text"
                                        placeholder="Username"
                                        {...register('username')}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        {...register('password')}
                                    />
                                    {errors.password && (
                                        <small className="error">{errors.password.message}</small>
                                    )}

                                    <button type="submit" className="btn">
                                        {isLogin ? 'Login' : 'Register'}
                                    </button>

                                    {/* {isLogin && <a href="#">Forgot Password?</a>} */}
                                </form>

                                {/* <div className="switch">
                                    <p>
                                        {isLogin
                                            ? "Don't have an account? "
                                            : 'Already have an account? '}
                                        <span
                                            onClick={toggleForm}
                                            style={{
                                                color: '#ff523b',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {isLogin ? 'Register' : 'Login'}
                                        </span>
                                    </p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
