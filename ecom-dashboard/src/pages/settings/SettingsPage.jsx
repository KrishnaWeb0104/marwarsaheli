import React, { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { useSettingStore } from "../../store/useSettingStore";

const SettingsPage = () => {
  const { userData, fetchUser, updateProfile, changePassword } = useSettingStore();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userData) {
      setForm((prev) => ({
        ...prev,
        fullName: userData?.fullName || "",
        email: userData?.email || "",
        phoneNumber: userData?.phoneNumber || "",
        address: userData?.address || "",
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    if (!editMode) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { fullName, email, phoneNumber, address } = form;
    await updateProfile({ fullName, email, phoneNumber, address });
    setEditMode(false);
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = form;
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match!");
    }
    await changePassword({ currentPassword, newPassword });
    setForm((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <Button onClick={() => setEditMode(!editMode)} variant="outline">
          {editMode ? "Cancel" : "Edit"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Full Name", name: "fullName" },
              { label: "Email", name: "email" },
              { label: "Phone Number", name: "phoneNumber" },
              { label: "Address", name: "address" },
            ].map(({ label, name }) => (
              <div key={name} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {label}
                </label>
                <Input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={label}
                  disabled={!editMode}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Current Password", name: "currentPassword" },
              { label: "New Password", name: "newPassword" },
              { label: "Confirm Password", name: "confirmPassword" },
            ].map(({ label, name }) => (
              <div key={name} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {label}
                </label>
                <Input
                  type="password"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={label}
                  disabled={!editMode}
                />
              </div>
            ))}

            {editMode && (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {editMode && (
        <div className="text-right">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
