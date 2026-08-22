import React, { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiSend, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;
const POLL_INTERVAL_MS = 5000;

function VendorChat() {
  const { user, authTokens } = useAuth();
  const [conversations, setConversations] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_URL}/chats/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (response.ok) setConversations(await response.json());
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const fetchThread = async (partnerId) => {
    try {
      const response = await fetch(`${API_URL}/chats/${partnerId}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (response.ok) setMessages(await response.json());
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, POLL_INTERVAL_MS * 2);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedPartner) return;
    fetchThread(selectedPartner.id);
    const interval = setInterval(() => fetchThread(selectedPartner.id), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [selectedPartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!body.trim() || !selectedPartner) return;

    setSending(true);
    try {
      const response = await fetch(`${API_URL}/chats/${selectedPartner.id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
      });
      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [...prev, newMessage]);
        setBody("");
        fetchConversations();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden h-[70vh] flex">
      <div
        className={`w-full sm:w-72 shrink-0 border-r border-slate-100 flex flex-col ${
          selectedPartner ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="px-4 py-3 border-b border-slate-100">
          <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FiMessageCircle className="text-primary-500" /> Chats
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {!conversations?.length ? (
            <p className="text-xs text-slate-400 text-center px-4 py-8">
              No conversations yet.
            </p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.partner.id}
                type="button"
                onClick={() => setSelectedPartner(conv.partner)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-left border-b border-slate-50 hover:bg-slate-50 transition ${
                  selectedPartner?.id === conv.partner.id ? "bg-primary-50/50" : ""
                }`}
              >
                <img
                  src={conv.partner.profile_image}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover shrink-0 bg-slate-50"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {conv.partner.username}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{conv.last_message}</p>
                </div>
                {conv.unread_count > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {conv.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      <div className={`flex-1 flex-col min-w-0 ${selectedPartner ? "flex" : "hidden sm:flex"}`}>
        {!selectedPartner ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              title="Select a conversation"
              description="Pick a customer from the list to view messages."
            />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="sm:hidden text-slate-400 hover:text-slate-600"
                aria-label="Back"
              >
                <FiArrowLeft />
              </button>
              <img
                src={selectedPartner.profile_image}
                alt=""
                className="w-8 h-8 rounded-full object-cover bg-slate-50"
              />
              <p className="text-sm font-semibold text-slate-800">
                {selectedPartner.username}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 bg-slate-50/40">
              {messages.map((msg) => {
                const isMine = msg.sender.id === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                      isMine
                        ? "self-end bg-primary-600 text-white rounded-br-sm"
                        : "self-start bg-white border border-slate-100 text-slate-700 rounded-bl-sm"
                    }`}
                  >
                    {msg.body}
                    <p
                      className={`text-[10px] mt-1 ${
                        isMine ? "text-primary-100" : "text-slate-400"
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 px-4 py-3 border-t border-slate-100"
            >
              <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button
                type="submit"
                disabled={sending || !body.trim()}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white transition shrink-0"
                aria-label="Send"
              >
                <FiSend className="text-sm" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default VendorChat;
