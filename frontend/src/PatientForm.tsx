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
      "If YES to this, go to ER now. You don’t need to fill out Questions 2–10.",
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
    helper: "This is called ‘uncontrolled bleeding’.",
  },
  {
    id: 4,
    title:
      "Is the cut on your eyelid or lip, OR on a hand/finger you can’t fully bend/straighten, OR is there new numbness/tingling near the cut, OR is bone exposed?",
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
  // Q1 YES -> ER now
  if (answers[0] === "yes") return "er";

  // Q2–4 YES -> ER now
  if (answers[1] === "yes" || answers[2] === "yes" || answers[3] === "yes") {
    return "er";
  }

  // Q5–7 or Q9 YES -> urgent today
  if (
    answers[4] === "yes" ||
    answers[5] === "yes" ||
    answers[6] === "yes" ||
    answers[8] === "yes"
  ) {
    return "urgent";
  }

  // Q8 YES -> self-care (if nothing above triggered)
  if (answers[7] === "yes") {
    return "self";
  }

  return "none";
}

const PatientForm: React.FC = () => {
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

  const handleChatSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  const outcomeCard = () => {
    if (outcome === "none") {
      return (
        <div
          style={{
            borderRadius: 12,
            padding: "0.8rem 1rem",
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.3)",
            fontSize: "0.9rem",
            marginBottom: "1rem",
          }}
        >
          <strong>Demo only:</strong> This checklist is for hackathon demo and
          education only. It is <strong>not</strong> medical advice.
        </div>
      );
    }
    if (outcome === "er") {
      return (
        <div
          style={{
            borderRadius: 12,
            padding: "0.9rem 1rem",
            background: "rgba(248,113,113,0.12)",
            border: "1px solid rgba(248,113,113,0.6)",
            marginBottom: "1rem",
          }}
        >
          <strong>🔴 ER now:</strong> based on your answers, this cut may need
          urgent assessment in the Emergency Department.
        </div>
      );
    }
    if (outcome === "urgent") {
      return (
        <div
          style={{
            borderRadius: 12,
            padding: "0.9rem 1rem",
            background: "rgba(250,204,21,0.12)",
            border: "1px solid rgba(250,204,21,0.6)",
            marginBottom: "1rem",
          }}
        >
          <strong>🟡 Urgent today:</strong> you should be seen in-person today
          (urgent care / walk-in / family doctor, depending on what&apos;s
          available).
        </div>
      );
    }
    return (
      <div
        style={{
          borderRadius: 12,
          padding: "0.9rem 1rem",
          background: "rgba(34,197,94,0.12)",
          border: "1px solid rgba(34,197,94,0.6)",
          marginBottom: "1rem",
        }}
      >
        <strong>🟢 Self-care at home (demo):</strong> for a small, clean cut
        with all answers otherwise low-risk, home care may be reasonable. Stop
        self-care and seek care if redness spreads, there is pus, fever, new
        numbness, or bleeding restarts.
      </div>
    );
  };

  return (
    <div
      style={{
        marginTop: "3rem",
        padding: "2rem 1.5rem 3rem",
        borderRadius: 16,
        background:
          "linear-gradient(180deg, #ffffff 0%, #e2f5ff 45%, #bde8ff 100%)",
        boxShadow: "0 10px 25px rgba(15,23,42,0.15)",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
        SafeTriage – Patient Questionnaire
      </h2>
      <p style={{ color: "#4b5563", fontSize: "0.9rem", marginBottom: "1rem" }}>
        Answer a short YES/NO checklist about your cut or minor injury, then
        add photos and extra notes.
      </p>

      {outcomeCard()}

      {/* Questions */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ marginTop: 0, marginBottom: "0.6rem" }}>
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
                  padding: "0.7rem 0.8rem",
                  borderRadius: 10,
                  background: "#f9fafb",
                  border:
                    q.id === 1 && q1Yes
                      ? "1px solid rgba(248,113,113,0.7)"
                      : "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    marginBottom: "0.3rem",
                  }}
                >
                  {q.id}. {q.title}
                </div>
                {q.helper && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#6b7280",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {q.helper}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    fontSize: "0.85rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleAnswer(index, "yes")}
                    disabled={disabled}
                    style={{
                      padding: "0.3rem 0.9rem",
                      borderRadius: 999,
                      border:
                        value === "yes"
                          ? "1px solid #ef4444"
                          : "1px solid #d4d4d8",
                      background:
                        value === "yes"
                          ? "rgba(248,113,113,0.08)"
                          : "#ffffff",
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswer(index, "no")}
                    disabled={disabled}
                    style={{
                      padding: "0.3rem 0.9rem",
                      borderRadius: 999,
                      border:
                        value === "no"
                          ? "1px solid #22c55e"
                          : "1px solid #d4d4d8",
                      background:
                        value === "no"
                          ? "rgba(34,197,94,0.08)"
                          : "#ffffff",
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                  >
                    NO
                  </button>
                  {disabled && index > 0 && (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#b91c1c",
                      }}
                    >
                      Question 1 was YES – ER now is advised; the rest are
                      optional.
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
        <h3 style={{ marginTop: 0, marginBottom: "0.6rem" }}>
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
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              Upload up to {MAX_PHOTOS} clear photos (demo only – they stay in
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
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              Use this box to jot down anything else you’d want a clinician to
              know (demo only – not sent anywhere).
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
                    style={{ fontSize: "0.85rem", color: "#777" }}
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
                          color: "#666",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{msg.sender}</span>
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
              <form
                onSubmit={handleChatSend}
                style={{
                  display: "flex",
                  borderTop: "1px solid #e4e4e7",
                }}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a note..."
                  style={{
                    flex: 1,
                    border: "none",
                    padding: "0.55rem 0.7rem",
                    font: "inherit",
                  }}
                />
                <button
                  type="submit"
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
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PatientForm;
