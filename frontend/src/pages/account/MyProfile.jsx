import { useEffect, useMemo, useRef, useState } from "react";
import { useAccountStore } from "../../store/useAccountStore";
import { useAddressStore } from "@/store/useAddressStore.js"; // NEW
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function MyProfile() {
  const {
    me,
    loading,
    error,
    fetchMe,
    updateAccount,
    uploadAvatar,
    changePassword,
    logout,
    updating,
    updatingAvatar,
    changingPassword,
    logoutLoading,
  } = useAccountStore();

  // NEW: Address store
  const {
    addresses,
    selectedAddressId,
    isLoading: addrLoading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
  } = useAddressStore();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  // NEW: local state for address form
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addrForm, setAddrForm] = useState({
    address: "", // NEW
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const fileRef = useRef(null);

  // fetch current user + addresses on mount
  useEffect(() => {
    fetchMe();
    fetchAddresses(); // NEW
  }, []);

  // hydrate form when me arrives
  useEffect(() => {
    if (me) {
      setForm({
        fullName: me.fullName || "",
        email: me.email || "",
        phoneNumber: me.phoneNumber || "",
        address: me.address || "",
      });
    }
  }, [me]);

  // avatar preview (live)
  const [preview, setPreview] = useState(null);
  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const onUploadAvatar = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return alert("Select an image first.");
    const res = await uploadAvatar(file);
    if (!res.ok) alert(res.message);
    else setPreview(null);
  };

  const onSave = async (e) => {
    e.preventDefault();
    const res = await updateAccount(form);
    if (!res.ok) alert(res.message);
  };

  const onChangePassword = async () => {
    const oldPassword = prompt("Old password");
    const newPassword = prompt("New password");
    if (!oldPassword || !newPassword) return;
    const res = await changePassword({ oldPassword, newPassword });
    if (!res.ok) alert(res.message);
    else alert("Password changed 🎉");
  };

  const onLogout = async () => {
    const res = await logout();
    if (!res.ok) alert(res.message);
  };

  // derived avatar url
  const avatarUrl = useMemo(() => {
    if (preview) return preview;
    return (
      me?.avatar ||
      "https://res.cloudinary.com/df2maejnd/image/upload/v1755153321/user_avatars/s5jwq6mfukzkl69idvbf.png"
    );
  }, [preview, me]);

  if (loading && !me) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const startAddAddress = () => {
    setEditingId(null);
    setAddrForm({
      address: "", // NEW
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
    setShowAddrForm(true);
  };

  const startEditAddress = (a) => {
    setEditingId(a._id);
    setAddrForm({
      address:
        a.address ||
        [a.street, a.city, a.state, a.zipCode, a.country]
          .filter(Boolean)
          .join(", "),
      street: a.street || "",
      city: a.city || "",
      state: a.state || "",
      zipCode: a.zipCode || "",
      country: a.country || "",
    });
    setShowAddrForm(true);
  };

  const submitAddress = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateAddress(editingId, addrForm);
    } else {
      await createAddress(addrForm);
    }
    setShowAddrForm(false);
    setEditingId(null);
  };

  const onDeleteAddress = async (id) => {
    await deleteAddress(id);
  };

  const onSelectAddress = (id) => setSelectedAddress(id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Profile Picture and Name */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={avatarUrl}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover mb-4"
        />

        <div className="flex gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPickFile}
            className="hidden"
          />
          <Button
            variant="secondary"
            onClick={() => fileRef.current?.click()}
            disabled={updatingAvatar}
          >
            {updatingAvatar ? "Uploading..." : "Choose Avatar"}
          </Button>
          <Button onClick={onUploadAvatar} disabled={updatingAvatar}>
            {updatingAvatar ? "Please wait..." : "Save Avatar"}
          </Button>
        </div>

        <h1 className="text-2xl font-semibold mt-4">
          {me?.fullName || "Your Name"}
        </h1>

        <div className="flex gap-3 mt-3">
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold"
            onClick={onSave}
            disabled={updating}
          >
            {updating ? "Saving..." : "Save Profile"}
          </Button>
          {/* <Button
            variant="secondary"
            onClick={onChangePassword}
            disabled={changingPassword}
          >
            {changingPassword ? "Changing..." : "Change Password"}
          </Button>
          <Button
            variant="destructive"
            onClick={onLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </Button> */}
        </div>
      </div>

      {/* Profile Details */}
      <form
        onSubmit={onSave}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm"
      >
        <div>
          <p className="text-gray-500 mb-1">Full Name</p>
          <input
            className="w-full border px-4 py-2 rounded-md"
            value={form.fullName}
            onChange={(e) =>
              setForm((s) => ({ ...s, fullName: e.target.value }))
            }
          />
        </div>

        <div>
          <p className="text-gray-500 mb-1">Email</p>
          <input
            type="email"
            className="w-full border px-4 py-2 rounded-md"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          />
        </div>

        <div>
          <p className="text-gray-500 mb-1">Mobile number</p>
          <input
            className="w-full border px-4 py-2 rounded-md"
            value={form.phoneNumber}
            onChange={(e) =>
              setForm((s) => ({ ...s, phoneNumber: e.target.value }))
            }
          />
        </div>

        {/* REMOVED old single address input - managed below by Address Manager */}
        <div className="hidden">
          <p className="text-gray-500 mb-1">Address</p>
          <input
            className="w-full border px-4 py-2 rounded-md"
            value={form.address}
            onChange={(e) =>
              setForm((s) => ({ ...s, address: e.target.value }))
            }
          />
        </div>
      </form>

      {/* Address Manager */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">Saved Addresses</p>
          <Button
            size="sm"
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold"
            onClick={startAddAddress}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {addrLoading ? (
          <div className="text-sm text-gray-600">Loading addresses…</div>
        ) : addresses.length === 0 ? (
          <div className="text-sm text-gray-600">No addresses saved yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div
                key={a._id}
                className={`border rounded-md p-4 text-sm ${
                  String(selectedAddressId) === String(a._id)
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {a.name || "Address"}
                      {String(selectedAddressId) === String(a._id) && (
                        <span className="ml-2 text-xs text-red-600">
                          (Selected)
                        </span>
                      )}
                    </p>
                    {/* Address list item - show address if available */}
                    <p className="text-gray-700 mt-1">
                      {a.address
                        ? a.address
                        : [a.street, a.city, a.state, a.zipCode, a.country]
                            .filter(Boolean)
                            .join(", ")}
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={String(selectedAddressId) === String(a._id)}
                    onChange={() => onSelectAddress(a._id)}
                    aria-label="Select this address"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => startEditAddress(a)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteAddress(a._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddrForm && (
          <form
            onSubmit={submitAddress}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border rounded-md p-4"
          >
            <div className="md:col-span-2 font-medium">
              {editingId ? "Edit Address" : "Add New Address"}
            </div>

            {/* NEW: Full Address replaces Street + City */}
            <div className="md:col-span-2">
              <p className="text-gray-500 mb-1">Full Address</p>
              <textarea
                className="w-full border px-3 py-2 rounded-md"
                rows={3}
                value={addrForm.address}
                onChange={(e) =>
                  setAddrForm((s) => ({ ...s, address: e.target.value }))
                }
                placeholder="House/Flat, Street, Area, Landmark"
                required
              />
            </div>

            {/* Keep other fields for pin/state/country */}
            <div>
              <p className="text-gray-500 mb-1">State</p>
              <input
                className="w-full border px-3 py-2 rounded-md"
                value={addrForm.state}
                onChange={(e) =>
                  setAddrForm((s) => ({ ...s, state: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <p className="text-gray-500 mb-1">Zip Code</p>
              <input
                className="w-full border px-3 py-2 rounded-md"
                value={addrForm.zipCode}
                onChange={(e) =>
                  setAddrForm((s) => ({ ...s, zipCode: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <p className="text-gray-500 mb-1">Country</p>
              <input
                className="w-full border px-3 py-2 rounded-md"
                value={addrForm.country}
                onChange={(e) =>
                  setAddrForm((s) => ({ ...s, country: e.target.value }))
                }
                required
              />
            </div>

            <div className="md:col-span-2 flex gap-3 mt-2">
              <Button type="submit" className="bg-[#BD1A12] text-white">
                {editingId ? "Save Changes" : "Add Address"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowAddrForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
