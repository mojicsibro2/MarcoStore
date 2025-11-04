import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../../api/productService";
import { categoryService, type Category } from "../../api/categoryService";

export default function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ Load product and categories
    useEffect(() => {
        const loadData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    productService.getById(id as string),
                    categoryService.getAll(),
                ]);

                const prod = prodRes;
                setForm({
                    name: prod.name,
                    description: prod.description || "",
                    price: String(prod.basePrice || ""),
                    stock: String(prod.stock || ""),
                    categoryId: prod.category?.id || "",
                });

                setCategories(catRes.data);
            } catch (err) {
                console.error(err);
                alert("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    // ✅ Handle text inputs
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Submit update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.price || !form.categoryId) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            await productService.update(id as string, {
                name: form.name,
                description: form.description,
                basePrice: Number(form.price),
                stock: Number(form.stock),
                categoryId: form.categoryId,
            });

            alert("Product updated successfully!");
            navigate("/supplier/products");
        } catch (err) {
            console.error(err);
            alert("Failed to update product.");
        }
    };

    if (loading) return <p className="loading-text">Loading product...</p>;

    return (
        <div className="edit-product-container">
            <h2>Edit Product</h2>

            <form className="edit-product-form" onSubmit={handleSubmit}>
                <label>Product Name</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                />

                <label>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                ></textarea>

                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                />

                <label>Stock</label>
                <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                />

                <label>Category</label>
                <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <button type="submit" className="btn-save">
                    Save Changes
                </button>
            </form>
        </div>
    );
}
