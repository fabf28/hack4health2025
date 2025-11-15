import React, { useState } from "react";

type YesNo = "yes" | "no" | "";

interface Question {
  id: number;
  title: string;
  helper?: string;
}

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

const MAX_PHOTOS = 5;

const QUESTIONS: Question[] = [
  {
    id: 1,
    title:
      "Do you have ANY of these RIGHT NOW: active bleeding, long or deep wound, signs of infection, bone sticking out, or new numbness/tingling?",
    helper:
      "If YES to this, go to ER now. You don't need to fill out Questions 2–10.",
  },
  {
    id: 2,
    title:
      "Is the cut bigger than 2.5 cm, deeper than 2 mm, or did it happen more than 8 hours ago?",
  },
  {
    id: 3,
    title:
      "Is the cut STILL bleeding after pressing firmly with a clean cloth or gauze for about 10 minutes?",
    helper: "This is called 'uncontrolled bleeding'.",
  },
  {
    id: 4,
    title:
      "Is the cut on your eyelid or lip, OR on a hand/finger you can't fully bend/straighten, OR is there new numbness/tingling near the cut, OR is bone exposed?",
  },
  {
    id: 5,
    title:
      "Did this happen in dirty water/soil (lake, river, flood water, etc.), OR has the wound become red, swollen, or with pus?",
  },
  {
    id: 6,
    title:
      "Do you think there might still be something inside the wound (glass, grit, dirt, splinter, etc.)?",
  },
  {
    id: 7,
    title:
      "Are you on blood thinners (warfarin, DOACs, aspirin/clopidogrel) OR do you have diabetes or a weak immune system?",
  },
  {
    id: 8,
    title:
      "Is the cut in a safer zone (forearm, shin, trunk, foot) AND everything above seems low-risk?",
  },
  {
    id: 9,
    title:
      "Are you unsure about any of your answers, OR are you under 18 years old?",
  },
  {
    id: 10,
    title:
      "For a small, clean cut, do you feel comfortable following simple self-care steps at home if advised?",
  },
];

type Outcome = "none" | "er" | "urgent" | "self";

function computeOutcome(answers: YesNo[]): Outcome {
  if (answers[0] === "yes") return "er";
  if (answers[1] === "yes" || answers[2] === "yes" || answers[3] === "yes") {
    return "er";
  }
  if (
    answers[4] === "yes" ||
    answers[5] === "yes" ||
    answers[6] === "yes" ||
    answers[8] === "yes"
  ) {
    return "urgent";
  }
  if (answers[7] === "yes") {
    return "self";
  }
  return "none";
}

export default function PatientForm() {
  const [answers, setAnswers] = useState<YesNo[]>(
    Array(QUESTIONS.length).fill("")
  );
  const [photos, setPhotos] = useState<File[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const outcome = computeOutcome(answers);
  const q1Yes = answers[0] === "yes";

  const handleAnswer = (index: number, value: YesNo) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const combined = [...photos, ...files].slice(0, MAX_PHOTOS);
    setPhotos(combined);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChatSend = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const msg: ChatMessage = {
      sender: "You",
      text: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => [...prev, msg]);
    setChatInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleChatSend();
    }
  };

  const outcomeCard = () => {
    if (outcome === "none") {
      return (
        <div
          style={{
            borderRadius: 12,
            padding: "1rem 1.25rem",
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.3)",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          <strong style={{ fontSize: "1rem", color: "#1e40af" }}>ℹ️ Demo only:</strong> This checklist is for hackathon demo and
          education only. It is <strong>not</strong> medical advice.
        </div>
      );
    }
    if (outcome === "er") {
      return (
        <div
          style={{
            borderRadius: 12,
            padding: "1rem 1.25rem",
            background: "rgba(248,113,113,0.12)",
            border: "1px solid rgba(248,113,113,0.6)",
            marginBottom: "1.5rem",
          }}
        >
          <strong style={{ fontSize: "1rem", color: "#991b1b" }}>🚨 ER now:</strong>{" "}
          <span style={{ color: "#7f1d1d" }}>
            Based on your answers, this cut may need urgent assessment in the Emergency Department.
          </span>
        </div>
      );
    }
    if (outcome === "urgent") {
      return (
        <div
          style={{
            borderRadius: 12,
            padding: "1rem 1.25rem",
            background: "rgba(250,204,21,0.12)",
            border: "1px solid rgba(250,204,21,0.6)",
            marginBottom: "1.5rem",
          }}
        >
          <strong style={{ fontSize: "1rem", color: "#92400e" }}>⚠️ Urgent today:</strong>{" "}
          <span style={{ color: "#78350f" }}>
            You should be seen in-person today (urgent care / walk-in / family doctor, depending on what's
            available).
          </span>
        </div>
      );
    }
    return (
      <div
        style={{
          borderRadius: 12,
          padding: "1rem 1.25rem",
          background: "rgba(34,197,94,0.12)",
          border: "1px solid rgba(34,197,94,0.6)",
          marginBottom: "1.5rem",
        }}
      >
        <strong style={{ fontSize: "1rem", color: "#065f46" }}>✅ Self-care at home (demo):</strong>{" "}
        <span style={{ color: "#064e3b" }}>
          For a small, clean cut with all answers otherwise low-risk, home care may be reasonable. Stop
          self-care and seek care if redness spreads, there is pus, fever, new numbness, or bleeding restarts.
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2.5rem 2rem 3rem",
          borderRadius: 16,
          background:
            "linear-gradient(180deg, #ffffff 0%, #e2f5ff 45%, #bde8ff 100%)",
          boxShadow: "0 10px 25px rgba(15,23,42,0.15)",
        }}
      >
      <h2 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1.8rem", fontWeight: 700, color: "#0f172a" }}>
        SafeTriage – Patient Questionnaire
      </h2>
      <p style={{ color: "#475569", fontSize: "1rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        Answer a short YES/NO checklist about your cut or minor injury, then
        add photos and extra notes.
      </p>

      {outcomeCard()}

      {/* Questions */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ marginTop: 0, marginBottom: "0.8rem", fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
          1. 10-question checklist
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
          }}
        >
          {QUESTIONS.map((q, index) => {
            const value = answers[index];
            const disabled = q1Yes && index > 0;

            return (
              <div
                key={q.id}
                style={{
                  padding: "1rem 1.2rem",
                  borderRadius: 12,
                  background: disabled ? "#f8fafc" : "#ffffff",
                  border:
                    q.id === 1 && q1Yes
                      ? "2px solid rgba(248,113,113,0.8)"
                      : "2px solid #e5e7eb",
                  opacity: disabled ? 0.65 : 1,
                  boxShadow: disabled ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    marginBottom: "0.4rem",
                    color: "#1f2937",
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ 
                    display: "inline-block",
                    minWidth: "1.75rem",
                    color: q.id === 1 && q1Yes ? "#dc2626" : "#6b7280",
                    fontWeight: 700,
                  }}>
                    {q.id}.
                  </span>{" "}
                  {q.title}
                </div>
                {q.helper && (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                      paddingLeft: "1.75rem",
                      fontStyle: "italic",
                    }}
                  >
                    💡 {q.helper}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    fontSize: "0.85rem",
                    paddingLeft: "1.75rem",
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleAnswer(index, "yes")}
                    disabled={disabled}
                    style={{
                      padding: "0.45rem 1.1rem",
                      borderRadius: 999,
                      border:
                        value === "yes"
                          ? "2px solid #ef4444"
                          : "1px solid #d4d4d8",
                      background:
                        value === "yes"
                          ? "rgba(248,113,113,0.1)"
                          : "#ffffff",
                      cursor: disabled ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      color: value === "yes" ? "#dc2626" : "#4b5563",
                      transition: "all 0.15s ease",
                    }}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswer(index, "no")}
                    disabled={disabled}
                    style={{
                      padding: "0.45rem 1.1rem",
                      borderRadius: 999,
                      border:
                        value === "no"
                          ? "2px solid #22c55e"
                          : "1px solid #d4d4d8",
                      background:
                        value === "no"
                          ? "rgba(34,197,94,0.1)"
                          : "#ffffff",
                      cursor: disabled ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      color: value === "no" ? "#059669" : "#4b5563",
                      transition: "all 0.15s ease",
                    }}
                  >
                    NO
                  </button>
                  {disabled && index > 0 && (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#dc2626",
                        fontWeight: 500,
                      }}
                    >
                      🔒 Question 1 was YES – ER now is advised; remaining questions are optional.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Photos + notes */}
      <section>
        <h3 style={{ marginTop: 0, marginBottom: "0.8rem", fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
          2. Wound photos & notes (demo)
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
            gap: "1.5rem",
          }}
        >
          {/* Photos */}
          <div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#64748b",
                marginBottom: "0.5rem",
                lineHeight: 1.5,
              }}
            >
              📸 Upload up to {MAX_PHOTOS} clear photos (demo only – they stay in
              your browser).
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
            />
            <div
              style={{
                marginTop: "0.4rem",
                fontSize: "0.85rem",
                color: "#4b5563",
              }}
            >
              {photos.length}/{MAX_PHOTOS} selected
            </div>
            {photos.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(90px, 1fr))",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {photos.map((file, index) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={index} style={{ position: "relative" }}>
                      <img
                        src={url}
                        alt={`Wound ${index + 1}`}
                        style={{
                          width: "100%",
                          height: 90,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        style={{
                          position: "absolute",
                          bottom: 4,
                          right: 4,
                          border: "none",
                          borderRadius: 999,
                          padding: "0.2rem 0.55rem",
                          fontSize: "0.75rem",
                          background: "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes / chat */}
          <div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#64748b",
                marginBottom: "0.5rem",
                lineHeight: 1.5,
              }}
            >
              💬 Frequently asked questions (FAQs) (demo only – not sent anywhere).
            </p>
            <div
              style={{
                borderRadius: 12,
                border: "1px solid #d4d4d8",
                display: "flex",
                flexDirection: "column",
                height: 260,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: "0.7rem",
                  overflowY: "auto",
                  background: "#f9fafb",
                }}
              >
                {chatMessages.length === 0 ? (
                  <div
                    style={{ fontSize: "0.85rem", color: "#94a3b8", textAlign: "center", padding: "1rem" }}
                  >
                    No notes yet. Start by typing a message 👋
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: "0.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "#475569" }}>{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          background: "#e0f2fe",
                          padding: "0.3rem 0.55rem",
                          borderRadius: 8,
                          marginTop: "0.1rem",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  borderTop: "1px solid #e4e4e7",
                }}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a note..."
                  style={{
                    flex: 1,
                    border: "none",
                    padding: "0.55rem 0.7rem",
                    font: "inherit",
                  }}
                />
                <button
                  type="button"
                  onClick={handleChatSend}
                  style={{
                    border: "none",
                    padding: "0 1rem",
                    font: "inherit",
                    cursor: "pointer",
                    background: "#22c55e",
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          type="button"
          onClick={() => {
            const allAnswered = answers.every(a => a !== "");
            if (!allAnswered && !q1Yes) {
              alert("Please answer all questions before submitting.");
              return;
            }
            alert(`Form submitted!\n\nOutcome: ${outcome}\nAnswers: ${answers.filter(a => a).length}/${QUESTIONS.length}\nPhotos: ${photos.length}\nNotes: ${chatMessages.length}`);
          }}
          style={{
            padding: "0.875rem 3rem",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "white",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
          }}
        >
          Submit Assessment
        </button>
        <p style={{ 
          marginTop: "1rem", 
          fontSize: "0.85rem", 
          color: "#64748b",
          fontStyle: "italic" 
        }}>
          This is a demo submission. No data will be sent to a server.
        </p>
      </div>
    </div>
  </div>
  );
}