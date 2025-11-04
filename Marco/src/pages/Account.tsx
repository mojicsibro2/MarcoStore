/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../app/store";
import { authService } from "../api/authService";
import { setCredentials } from "../auth/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type FormData = {
  name?: string;
  email: string;
  role?: string;
  password: string;
};

// ✅ Validation Schemas
const loginSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

const registerSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    role: yup.string().required("Role is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
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
    } = useForm<FormData>({
        resolver: yupResolver(isLogin ? loginSchema : registerSchema),
    });

    // ✅ Submit Handler
    const onSubmit = async (data: any) => {
        try {
            if (isLogin) {
                const res = await authService.login(data.email, data.password);
                dispatch(
                    setCredentials({
                        user: res.user,
                        token: res.access_token,
                    })
                );
                navigate("/");
            } else {
                await authService.register(data);
                alert("✅ Registration successful! Please login.");
                setIsLogin(true);
                reset();
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "❌ Something went wrong");
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
                                        onClick={() => {
                                            setIsLogin(true);
                                            reset();
                                        }}
                                        className={isLogin ? "active" : ""}
                                    >
                                        Login
                                    </span>
                                    <span
                                        onClick={() => {
                                            setIsLogin(false);
                                            reset();
                                        }}
                                        className={!isLogin ? "active" : ""}
                                    >
                                        Register
                                    </span>
                                </div>

                                {/* ✅ FORM */}
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {!isLogin && (
                                        <>
                                            {/* Name Field */}
                                            <input type="text" placeholder="Name" {...register("name")} />
                                            {errors.name && <small className="error">{errors.name.message}</small>}

                                            {/* Role Field */}
                                            <select {...register("role")}>
                                                <option value="">-- Select Role --</option>
                                                <option value="customer">Customer</option>
                                                <option value="supplier">Supplier</option>
                                            </select>
                                            {errors.role && <small className="error">{errors.role.message}</small>}
                                        </>
                                    )}

                                    {/* Email Field */}
                                    <input type="email" placeholder="Email" {...register("email")} />
                                    {errors.email && <small className="error">{errors.email.message}</small>}

                                    {/* Password Field */}
                                    <input type="password" placeholder="Password" {...register("password")} />
                                    {errors.password && <small className="error">{errors.password.message}</small>}

                                    <button type="submit" className="btn">
                                        {isLogin ? "Login" : "Register"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
