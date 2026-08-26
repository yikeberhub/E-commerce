import React, { useEffect, useState } from "react";
import { FiSettings, FiSave } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass, checkboxClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";

const API_URL = process.env.REACT_APP_API_URL;

function AdminSettings() {
  const { authTokens } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/admin_api/settings/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        if (!response.ok) throw new Error("Failed to load settings.");
        setSettings(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const response = await fetch(`${API_URL}/admin_api/settings/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error("Failed to save settings.");
      setSettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5 max-w-2xl">
      <h1 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <FiSettings className="text-primary-500" /> Platform Settings
      </h1>

      {loading ? (
        <RowSkeleton count={4} />
      ) : (
        <form onSubmit={save} className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          {saved && (
            <p className="text-sm text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
              Settings saved.
            </p>
          )}

          <div>
            <label className="text-xs font-medium text-slate-500">Site name</label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => setSettings((s) => ({ ...s, site_name: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Support email</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings((s) => ({ ...s, support_email: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Support phone</label>
              <input
                type="text"
                value={settings.support_phone}
                onChange={(e) => setSettings((s) => ({ ...s, support_phone: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Platform commission rate (%)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={settings.commission_rate}
              onChange={(e) => setSettings((s) => ({ ...s, commission_rate: e.target.value }))}
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.allow_vendor_registration}
              onChange={(e) => setSettings((s) => ({ ...s, allow_vendor_registration: e.target.checked }))}
              className={checkboxClass}
            />
            Allow new vendor registrations
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={(e) => setSettings((s) => ({ ...s, maintenance_mode: e.target.checked }))}
              className={checkboxClass}
            />
            Maintenance mode
          </label>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-1.5 mt-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition"
          >
            <FiSave className="text-sm" /> {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      )}
    </div>
  );
}

export default AdminSettings;
