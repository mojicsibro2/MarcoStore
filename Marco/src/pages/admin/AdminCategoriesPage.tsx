/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { categoryService } from "../../api/categoryService";

interface CategoryForm {
    id?: string;
    name: string;
    description: string;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [form, setForm] = useState<CategoryForm>({ name: "", description: "" });
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    // ✅ Fetch categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await categoryService.getAll();
            setCategories(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // ✅ Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Create or Update category
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Please enter a category name.");
            return;
        }

        try {
            if (editingId) {
                await categoryService.update(editingId, {
                    name: form.name,
                    description: form.description,
                });
                alert("Category updated successfully!");
            } else {
                await categoryService.create({
                    name: form.name,
                    description: form.description,
                });
                alert("Category created successfully!");
            }

            setForm({ name: "", description: "" });
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Failed to save category.");
        }
    };

    // ✅ Edit category
    const handleEdit = (cat: any) => {
        setEditingId(cat.id);
        setForm({ id: cat.id, name: cat.name, description: cat.description || "" });
    };

    // ✅ Delete category
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await categoryService.delete(id);
            alert("Category deleted successfully!");
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Failed to delete category.");
        }
    };

    if (loading) return <p className="loading-text">Loading categories...</p>;

    return (
        <div className="admin-categories">
            <h2>📂 Manage Categories</h2>

            {/* Category Form */}
            <form className="category-form" onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter category name"
                    value={form.name}
                    onChange={handleChange}
                />

                <label>Description</label>
                <textarea
                    name="description"
                    placeholder="Enter category description"
                    value={form.description}
                    onChange={handleChange}
                ></textarea>

                <button type="submit" className="btn-save">
                    {editingId ? "Update Category" : "Add Category"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                            setEditingId(null);
                            setForm({ name: "", description: "" });
                        }}
                    >
                        Cancel Edit
                    </button>
                )}
            </form>

            {/* Category Table */}
            <table className="categories-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="no-categories">
                                No categories found.
                            </td>
                        </tr>
                    ) : (
                        categories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.name}</td>
                                <td>{cat.description || "—"}</td>
                                <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => handleEdit(cat)}>
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(cat.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
