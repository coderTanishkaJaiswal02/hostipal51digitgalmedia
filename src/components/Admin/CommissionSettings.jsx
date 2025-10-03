import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  fetchDoctors,
  createUser,
  updateUser,
  deleteUser,
} from "../../redux/Slices/CommissionSettingsSlice";
import {
  Search,
  Shield,
  Trash2,
  Edit,
  PlusCircle,
  ChevronUp,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CommissionSettings() {
  const dispatch = useDispatch();
  const { data: commissions = [], doctors = {}, loading } = useSelector(
    (state) => state.commission_settings ?? {}
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    doctor_id: "",
    type: "",
    source: "",
    value: "",
    calculation_type: "",
  });

  useEffect(() => {
    dispatch(fetchData());
    dispatch(fetchDoctors());
  }, [dispatch]);

  const filteredCommissions = commissions.filter((c) => {
    const doctorName = doctors[c.doctor_id]?.name || "";
    const combined = `${doctorName} ${c.type} ${c.source}`.toLowerCase();
    return combined.includes(search.toLowerCase());
  });

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("Commission deleted successfully 🎉");
      dispatch(fetchData());
    } catch {
      toast.error("Delete failed 🚫");
    }
    setDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    try {
      if (!editData) {
        await dispatch(createUser(payload)).unwrap();
        toast.success("Commission added successfully 🎉");
      } else {
        await dispatch(
          updateUser({ id: editData.id, updatedUser: payload })
        ).unwrap();
        toast.success("Commission updated successfully 🎉");
      }
      resetForm();
      dispatch(fetchData());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed 🚫" : "Add failed 🚫");
    }
  };

  const resetForm = () => {
    setFormData({
      doctor_id: "",
      type: "",
      source: "",
      value: "",
      calculation_type: "",
    });
    setEditData(null);
  };

  // Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        doctor_id: editData.doctor_id || "",
        type: editData.type || "",
        source: editData.source || "",
        value: editData.value || "",
        calculation_type: editData.calculation_type || "",
      });
    }
  }, [editData]);

  return (
    <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

    
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-white p-4 rounded-xl shadow flex justify-between flex-col gap-4 mb-6">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-3">
              <Shield size={32} color="white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold">
                Commission Settings
              </h2>
              <p className="text-sm opacity-80">
                Manage doctor commissions
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Commission
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search commissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Total count */}
      <div className="mb-2 font-semibold text-gray-700">
        Total Commissions: {commissions.length}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white text-left rounded text-sm md:text-base">
              <th className="p-3">S.No</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Type</th>
              <th className="p-3">Source</th>
              <th className="p-3">Value</th>
              <th className="p-3">Calculation</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
             {loading ? (
          <p className=" text-center text-gray-600 font-medium">
            Loading commissions...
          </p>
        )  
        : 
         filteredCommissions.length > 0 ? (
              filteredCommissions.map((c, idx) => (
                
                <tr key={c.id} className="hover:bg-gray-50 text-sm md:text-base">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{doctors[c.doctor_id]?.name}</td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3">{c.source}</td>
                  <td className="p-3">{c.value}</td>
                  <td className="p-3">{c.calculation_type}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditData(c);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No commissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
     
      <div className="md:hidden flex flex-col gap-4">
        {loading ? (
          <p className=" text-green-600 font-medium">
            Loading commissions...
          </p>
        )  
        : filteredCommissions.length > 0 ? (
          filteredCommissions.map((c) => (
            <div
              key={c.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {doctors[c.doctor_id]?.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {c.type} • {c.source}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === c.id ? null : c.id)
                  }
                  className={`transform transition-transform duration-300 ${
                    expandedId === c.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronUp size={20} />
                </button>
              </div>

              {expandedId === c.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Value: </span>
                    {c.value}
                  </p>
                  <p>
                    <span className="font-semibold">Calculation: </span>
                    {c.calculation_type}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditData(c);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No commissions found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Commission" : "Add Commission"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={formData.doctor_id}
                onChange={(e) =>
                  setFormData({ ...formData, doctor_id: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Doctor</option>
                {Object.values(doctors).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Source"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Value"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Calculation Type"
                value={formData.calculation_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    calculation_type: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
                >
                  {editData ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete this commission?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-xl"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


