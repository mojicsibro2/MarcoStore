import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService, type Product } from "../../api/productService";


export default function SupplierProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const res = await productService.getById(id);
        setProduct(res);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p>❌ Product not found.</p>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "PENDING":
        return "orange";
      case "INACTIVE":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <>

      <div className="select-categories4">
        <div className="coltop4">
          <button onClick={() => navigate(-1)} className="close">
            ← Back
          </button>
          <Link to={`/supplier/products/${product.id}/edit`}>
            <p>Edit</p>
          </Link>
        </div>

        <div className="select3">
          {/* Main Product Image */}
          <div className="col4">
            <img
              src={product.image?.imageUrl || "/images/placeholder.png"}
              alt={product.name}
            />
          </div>

          {/* Remove thumbnail gallery since only one image */}
          {/* <div className="col4-small"> ... </div> */}

          {/* Details */}
          <div className="details">
            <p>Product Price</p>
            <p>€{product.finalPrice ?? product.basePrice}</p>

            <br />
            <h3>Product Description</h3>
            <p>{product.description || "No description provided."}</p>

            <br />
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: getStatusColor(product.status),
                  fontWeight: 600,
                }}
              >
                {product.status}
              </span>
            </p>

            <p>
              <strong>Category:</strong> {product.category?.name}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock}
            </p>
            <p>
              <strong>Added On:</strong>{" "}
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="col">
            <div className="add-product">
              <button
                onClick={() => navigate("/supplier/dashboard")}
                className="btn"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
