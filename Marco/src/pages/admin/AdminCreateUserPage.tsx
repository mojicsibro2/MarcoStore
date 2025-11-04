/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../api/userServices";

export default function AdminCreateUserPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password || !form.role) {
            alert("Please fill all fields.");
            return;
        }

        try {
            setLoading(true);
            await userService.adminCreateUser({ name: form.name, email: form.email, password: form.password, role: form.role });
            alert("User created successfully!");
            navigate("/admin/users");
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to create user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-user-container">
            <h2>Create New User</h2>

            <form className="create-user-form" onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter user name"
                    value={form.name}
                    onChange={handleChange}
                />

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter user email"
                    value={form.email}
                    onChange={handleChange}
                />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                />

                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="customer">Customer</option>
                    <option value="supplier">Supplier</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                </select>

                <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? "Creating..." : "Create User"}
                </button>
            </form>
        </div>
    );
}
