/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { productService } from "../../api/productService";
import { categoryService } from "../../api/categoryService";

// ✅ Validation Schema
const schema = yup.object({
    name: yup.string().required("Product name is required"),
    categoryId: yup.string().required("Category is required"),
    description: yup.string().required("Description is required"),
    basePrice: yup.number().positive().required("Price is required"),
    stock: yup.number().positive().required("Stock is required"),
    image: yup.mixed().required("Please upload an image"),
});

interface Category {
    id: string;
    name: string;
}

export default function AddProductPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAll(1, 50);
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("categoryId", data.categoryId);
            formData.append("basePrice", data.basePrice.toString());
            formData.append("stock", data.stock.toString());

            if (data.image && data.image.length > 0) {
                formData.append("image", data.image[0]);
            }

            await productService.create(formData);

            alert("✅ Product added successfully!");
            reset();
            navigate("/supplier/dashboard");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to add product");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="categories-container1">
                <div className="coltop">
                    <button className="close" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <p>New Product</p>
                </div>

                <div className="cat-body">
                    <form className="categories2" onSubmit={handleSubmit(onSubmit)}>
                        {/* Product Name */}
                        <div className="col3">
                            <p>Product Name</p>
                            <input type="text" placeholder="Product Name" {...register("name")} />
                            {errors.name && <small className="error">{errors.name.message}</small>}
                        </div>

                        {/* Category */}
                        <div className="col3">
                            <p>Product Category</p>
                            <select {...register("categoryId")}>
                                <option value="">-- Select Category --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && <small className="error">{errors.categoryId.message}</small>}
                        </div>

                        {/* Description */}
                        <div className="col3">
                            <p>Description</p>
                            <textarea placeholder="Description" {...register("description")} />
                            {errors.description && <small className="error">{errors.description.message}</small>}
                        </div>

                        {/* Price */}
                        <div className="col3">
                            <p>Price (€)</p>
                            <input type="number" placeholder="Price" {...register("basePrice")} />
                            {errors.basePrice && <small className="error">{errors.basePrice.message}</small>}
                        </div>

                        {/* Stock */}
                        <div className="col3">
                            <p>Quantity</p>
                            <input type="number" placeholder="Stock" {...register("stock")} />
                            {errors.stock && <small className="error">{errors.stock.message}</small>}
                        </div>

                        {/* Image Upload */}
                        <div className="col3">
                            <p>Upload Product Image</p>
                            <input type="file" accept="image/*" {...register("image")} />
                            
                            {errors.image && <small className="error">{errors.image.message}</small>}
                        </div>

                        {/* Submit Button */}
                        <div className="add-product">
                            <button type="submit" disabled={loading} className="btn">
                                {loading ? "Uploading..." : "Add Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
