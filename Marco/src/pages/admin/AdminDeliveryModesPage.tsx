/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { deliveryService } from "../../api/deliveryService";

interface DeliveryForm {
  name: string;
  description: string;
  fee: string;
  estimatedTime: string;
  isActive: boolean;
}

export default function AdminDeliveryModesPage() {
  const [modes, setModes] = useState<any[]>([]);
  const [form, setForm] = useState<DeliveryForm>({
    name: "",
    description: "",
    fee: "",
    estimatedTime: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ✅ Load delivery modes
  const fetchModes = async () => {
    setLoading(true);
    try {
      const res = await deliveryService.getAll();
      setModes(res);
    } catch (err) {
      console.error(err);
      alert("Failed to load delivery modes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModes();
  }, []);

  // ✅ Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "isActive") {
      setForm({ ...form, isActive: value === "true" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.fee || !form.estimatedTime.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (editingId) {
        await deliveryService.update(editingId, {
          ...form,
          fee: Number(form.fee),
        });
        alert("Delivery mode updated successfully!");
      } else {
        await deliveryService.create({
          ...form,
          fee: Number(form.fee),
        });
        alert("Delivery mode created successfully!");
      }

      setForm({
        name: "",
        description: "",
        fee: "",
        estimatedTime: "",
        isActive: true,
      });
      setEditingId(null);
      fetchModes();
    } catch (err) {
      console.error(err);
      alert("Failed to save delivery mode.");
    }
  };

  // ✅ Edit mode
  const handleEdit = (mode: any) => {
    setEditingId(mode.id);
    setForm({
      name: mode.name,
      description: mode.description || "",
      fee: String(mode.fee),
      estimatedTime: mode.estimatedTime,
      isActive: mode.isActive,
    });
  };

  // ✅ Delete mode
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this delivery mode?")) return;

    try {
      await deliveryService.delete(id);
      alert("Delivery mode deleted successfully!");
      fetchModes();
    } catch (err) {
      console.error(err);
      alert("Failed to delete delivery mode.");
    }
  };

  if (loading) return <p className="loading-text">Loading delivery modes...</p>;

  return (
    <div className="admin-delivery">
      <h2>🚚 Manage Delivery Modes</h2>

      {/* Form */}
      <form className="delivery-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter delivery mode name"
          value={form.name}
          onChange={handleChange}
        />

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Enter delivery mode description"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        <label>Fee (€)</label>
        <input
          type="number"
          name="fee"
          placeholder="Enter delivery fee"
          value={form.fee}
          onChange={handleChange}
        />

        <label>Estimated Time</label>
        <input
          type="text"
          name="estimatedTime"
          placeholder="e.g. 2–3 business days"
          value={form.estimatedTime}
          onChange={handleChange}
        />

        <label>Status</label>
        <select
          name="isActive"
          value={String(form.isActive)}
          onChange={handleChange}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <button type="submit" className="btn-save">
          {editingId ? "Update Mode" : "Add Mode"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setEditingId(null);
              setForm({
                name: "",
                description: "",
                fee: "",
                estimatedTime: "",
                isActive: true,
              });
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Table */}
      <table className="delivery-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Fee (€)</th>
            <th>Estimated Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {modes.length === 0 ? (
            <tr>
              <td colSpan={5} className="no-modes">
                No delivery modes found.
              </td>
            </tr>
          ) : (
            modes.map((mode) => (
              <tr key={mode.id}>
                <td>{mode.name}</td>
                <td>{Number(mode.fee).toLocaleString()}</td>
                <td>{mode.estimatedTime}</td>
                <td>{mode.isActive ? "✅ Active" : "❌ Inactive"}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(mode)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(mode.id)}
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
