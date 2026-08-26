import React, { useEffect, useMemo, useState } from "react";
import { FiMail, FiTrash2, FiSend, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { selectClass, inputClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

const STATUS_STYLES = {
  new: "bg-primary-50 text-primary-600",
  read: "bg-amber-50 text-amber-600",
  resolved: "bg-emerald-50 text-emerald-600",
};

function AdminContact() {
  const { authTokens } = useAuth();
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin_api/super-admin-dashboard/contact/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to load messages.");
      setMessages(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openMessage = async (msg) => {
    const willExpand = expandedId !== msg.id;
    setExpandedId(willExpand ? msg.id : null);
    setReplyText(msg.admin_reply || "");
    if (willExpand && msg.status === "new") {
      try {
        const response = await fetch(`${API_URL}/admin_api/super-admin-dashboard/contact/${msg.id}/`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "read" }),
        });
        if (response.ok) {
          const updated = await response.json();
          setMessages((prev) => prev.map((m) => (m.id === msg.id ? updated : m)));
        }
      } catch {
        // non-critical — leave status as-is if this fails
      }
    }
  };

  const sendReply = async (id) => {
    if (!replyText.trim()) return;
    setBusyId(id);
    try {
      const response = await fetch(`${API_URL}/admin_api/super-admin-dashboard/contact/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin_reply: replyText.trim() }),
      });
      if (!response.ok) throw new Error("Failed to send reply.");
      const updated = await response.json();
      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const deleteMessage = async (id) => {
    setBusyId(id);
    try {
      const response = await fetch(`${API_URL}/admin_api/super-admin-dashboard/contact/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to delete message.");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    if (statusFilter === "all") return messages;
    return messages.filter((m) => m.status === statusFilter);
  }, [messages, statusFilter]);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiMail className="text-primary-500" /> Contact Messages
        </h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>
      )}

      {loading ? (
        <RowSkeleton count={4} />
      ) : !filteredMessages.length ? (
        <EmptyState title="No messages found" description="Contact form submissions will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredMessages.map((msg) => {
            const isExpanded = expandedId === msg.id;
            const isBusy = busyId === msg.id;

            return (
              <div key={msg.id} className="border border-slate-100 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => openMessage(msg)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50/60 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-slate-800 truncate">{msg.name}</p>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[msg.status]}`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {msg.subject || "(no subject)"} — {msg.email}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                  <FiChevronDown className={`text-slate-400 transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 p-3 bg-slate-50/50 flex flex-col gap-3">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.message}</p>

                    {msg.admin_reply && (
                      <div className="bg-primary-50 rounded-lg p-3 text-sm text-primary-700">
                        <p className="text-xs font-medium text-primary-500 mb-1">Your reply</p>
                        {msg.admin_reply}
                      </div>
                    )}

                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      rows={3}
                      className={inputClass}
                    />

                    <div className="flex items-center justify-end gap-2">
                      {confirmDeleteId === msg.id ? (
                        <div className="flex items-center gap-1.5 mr-auto">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1.5"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => deleteMessage(msg.id)}
                            className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-2.5 py-1.5 rounded-lg transition"
                          >
                            {isBusy ? "Deleting..." : "Confirm delete"}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(msg.id)}
                          className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 mr-auto"
                        >
                          <FiTrash2 className="text-sm" /> Delete
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={isBusy || !replyText.trim()}
                        onClick={() => sendReply(msg.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-lg py-2 px-4 transition"
                      >
                        <FiSend className="text-sm" /> {isBusy ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminContact;
