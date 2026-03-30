import { useState, useEffect } from “react”;

const DAYS = [“Mon”, “Tue”, “Wed”, “Thu”, “Fri”, “Sat”, “Sun”];
const DAY_FULL = [“Monday”, “Tuesday”, “Wednesday”, “Thursday”, “Friday”, “Saturday”, “Sunday”];

const SLOTS = {
Mon: [
{ id: “morning”, label: “🌅 Morning Grind”, time: “9:00 – 10:00 AM”, type: “influencer” },
{ id: “work”, label: “💼 Work From Home”, time: “10:00 AM – 6:00 PM”, type: “work”, locked: true },
{ id: “evening”, label: “✨ Evening Create”, time: “9:00 – 10:00 PM”, type: “influencer” },
],
Tue: [
{ id: “morning”, label: “🌅 Morning Grind”, time: “9:00 – 10:00 AM”, type: “influencer” },
{ id: “work”, label: “💼 Work From Home”, time: “10:00 AM – 6:00 PM”, type: “work”, locked: true },
{ id: “evening”, label: “✨ Evening Create”, time: “9:00 – 10:00 PM”, type: “influencer” },
],
Wed: [
{ id: “morning”, label: “🌅 Morning Grind”, time: “9:00 – 10:00 AM”, type: “influencer” },
{ id: “work”, label: “💼 Work From Home”, time: “10:00 AM – 6:00 PM”, type: “work”, locked: true },
{ id: “evening”, label: “✨ Evening Create”, time: “9:00 – 10:00 PM”, type: “influencer” },
],
Thu: [
{ id: “morning”, label: “🌅 Morning Grind”, time: “9:00 – 10:00 AM”, type: “influencer” },
{ id: “work”, label: “💼 Work From Home”, time: “10:00 AM – 6:00 PM”, type: “work”, locked: true },
{ id: “evening”, label: “✨ Evening Create”, time: “9:00 – 10:00 PM”, type: “influencer” },
],
Fri: [
{ id: “morning”, label: “🌅 Morning Grind”, time: “9:00 – 10:00 AM”, type: “influencer” },
{ id: “work”, label: “💼 Work From Home”, time: “10:00 AM – 6:00 PM”, type: “work”, locked: true },
{ id: “evening”, label: “✨ Evening Create”, time: “9:00 – 10:00 PM”, type: “influencer” },
],
Sat: [
{ id: “am”, label: “🎬 Content Day AM”, time: “9:00 AM – 1:00 PM”, type: “influencer” },
{ id: “pm”, label: “📸 Content Day PM”, time: “2:00 – 6:00 PM”, type: “influencer” },
{ id: “eve”, label: “🌙 Plan & Schedule”, time: “7:00 – 9:00 PM”, type: “influencer” },
],
Sun: [
{ id: “am”, label: “✍️ Write & Edit”, time: “10:00 AM – 1:00 PM”, type: “influencer” },
{ id: “pm”, label: “📊 Analyse & Engage”, time: “3:00 – 6:00 PM”, type: “influencer” },
{ id: “prep”, label: “📋 Week Prep”, time: “7:00 – 8:00 PM”, type: “influencer” },
],
};

const TASK_PRESETS = {
morning: [“Record Reel / TikTok”, “Post & engage 30 mins”, “Reply to comments”, “Schedule stories”, “Research trending audio”],
evening: [“Edit content”, “Write captions”, “Respond to DMs”, “Plan tomorrow’s post”, “Collaborate outreach”],
am: [“Batch film content”, “Lifestyle shots”, “Behind the scenes”, “Collab filming”, “Product showcase”],
pm: [“Edit videos”, “Photo editing”, “Thumbnail design”, “Caption writing”, “Hashtag research”],
eve: [“Schedule week’s posts”, “Analytics review”, “Reply to all comments”, “Brand email replies”, “Mood board for next week”],
write: [“Write blog / newsletter”, “Script next video”, “Captions batch write”, “Story ideas brainstorm”],
analyse: [“Check analytics”, “Competitor research”, “DM & comment replies”, “Community engagement”],
prep: [“Plan content calendar”, “Prep outfits / props”, “Grocery for recipe content”, “Set weekly goals”],
};

const DEFAULT_TASKS = {
Mon: { morning: “”, evening: “” },
Tue: { morning: “”, evening: “” },
Wed: { morning: “”, evening: “” },
Thu: { morning: “”, evening: “” },
Fri: { morning: “”, evening: “” },
Sat: { am: “”, pm: “”, eve: “” },
Sun: { am: “”, pm: “”, prep: “” },
};

const INFLUENCER_TIPS = [
“Batch film on weekends — film 5–7 pieces at once to stay ahead.”,
“Your morning hour is golden. Post, engage, then create.”,
“Evening is for editing & scheduling — protect this hour ruthlessly.”,
“Saturday is your creative powerhouse day. Treat it like a studio day.”,
“Sunday analytics help you double down on what actually works.”,
“Consistency > perfection. Done is better than perfect.”,
“Reply to EVERY comment in the first hour of posting — it signals the algorithm.”,
];

const COLORS = {
influencer: { bg: “rgba(255,180,120,0.12)”, border: “#f0956a”, tag: “#f0956a”, text: “#c05a20” },
work: { bg: “rgba(120,160,255,0.08)”, border: “#7aa0e8”, tag: “#7aa0e8”, text: “#3a5db0” },
};

const WEEK_DAYS_IDX = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4 };
const todayIdx = new Date().getDay(); // 0=Sun,1=Mon…
const todayDayKey = [“Sun”, “Mon”, “Tue”, “Wed”, “Thu”, “Fri”, “Sat”][todayIdx];

let taskIdCounter = 1;

function makeTask(text) {
return { id: taskIdCounter++, text, done: false };
}

const initTasks = () => {
const t = {};
DAYS.forEach(d => {
t[d] = {};
SLOTS[d].forEach(s => {
if (!s.locked) t[d][s.id] = [];
});
});
return t;
};

export default function WeeklyPlanner() {
const [activeDay, setActiveDay] = useState(DAYS.includes(todayDayKey) ? todayDayKey : “Mon”);
const [tasks, setTasks] = useState(initTasks);
const [inputs, setInputs] = useState(() => {
const i = {};
DAYS.forEach(d => { i[d] = {}; SLOTS[d].forEach(s => { if (!s.locked) i[d][s.id] = “”; }); });
return i;
});
const [tipIdx, setTipIdx] = useState(0);
const [goalText, setGoalText] = useState(””);
const [goals, setGoals] = useState([]);
const [showGoalInput, setShowGoalInput] = useState(false);
const [activeSlot, setActiveSlot] = useState(null);

useEffect(() => {
const t = setInterval(() => setTipIdx(i => (i + 1) % INFLUENCER_TIPS.length), 6000);
return () => clearInterval(t);
}, []);

const addTask = (day, slotId) => {
const text = inputs[day][slotId].trim();
if (!text) return;
setTasks(prev => ({
…prev,
[day]: { …prev[day], [slotId]: […(prev[day][slotId] || []), makeTask(text)] }
}));
setInputs(prev => ({ …prev, [day]: { …prev[day], [slotId]: “” } }));
};

const toggleTask = (day, slotId, taskId) => {
setTasks(prev => ({
…prev,
[day]: {
…prev[day],
[slotId]: prev[day][slotId].map(t => t.id === taskId ? { …t, done: !t.done } : t)
}
}));
};

const deleteTask = (day, slotId, taskId) => {
setTasks(prev => ({
…prev,
[day]: { …prev[day], [slotId]: prev[day][slotId].filter(t => t.id !== taskId) }
}));
};

const addPreset = (day, slotId, text) => {
setTasks(prev => ({
…prev,
[day]: { …prev[day], [slotId]: […(prev[day][slotId] || []), makeTask(text)] }
}));
setActiveSlot(null);
};

const addGoal = () => {
if (!goalText.trim()) return;
setGoals(prev => […prev, { id: taskIdCounter++, text: goalText.trim(), done: false }]);
setGoalText(””);
setShowGoalInput(false);
};

const totalInfluencerTasks = DAYS.reduce((acc, d) => {
return acc + SLOTS[d].filter(s => !s.locked).reduce((a, s) => a + (tasks[d][s.id]?.length || 0), 0);
}, 0);
const doneTasks = DAYS.reduce((acc, d) => {
return acc + SLOTS[d].filter(s => !s.locked).reduce((a, s) => a + (tasks[d][s.id]?.filter(t => t.done).length || 0), 0);
}, 0);

const isWeekend = activeDay === “Sat” || activeDay === “Sun”;
const isToday = activeDay === todayDayKey;

const presetKey = {
morning: “morning”, evening: “evening”,
am: “am”, pm: “pm”, eve: “eve”,
prep: “prep”,
};

return (
<div style={{
minHeight: “100vh”,
background: “#0d0d0f”,
color: “#f0ece4”,
fontFamily: “‘DM Serif Display’, ‘Playfair Display’, Georgia, serif”,
}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #1a1a1f; } ::-webkit-scrollbar-thumb { background: #3a3a45; border-radius: 2px; } .day-btn { transition: all 0.2s; } .day-btn:hover { background: rgba(240,149,106,0.15) !important; } .task-row:hover .del-btn { opacity: 1 !important; } .slot-card { transition: box-shadow 0.2s; } .slot-card:hover { box-shadow: 0 4px 24px rgba(240,149,106,0.08); } .preset-chip:hover { background: rgba(240,149,106,0.25) !important; cursor: pointer; } .check-btn:hover { border-color: #f0956a !important; } @keyframes tipfade { 0%,100%{opacity:0;transform:translateY(4px)} 10%,90%{opacity:1;transform:translateY(0)} } .tip-anim { animation: tipfade 6s ease-in-out infinite; } @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} } .fade-in { animation: fadeIn 0.35s ease forwards; }`}</style>

```
  {/* Top Header */}
  <div style={{
    borderBottom: "1px solid #1e1e26",
    padding: "1.5rem 2rem 1rem",
    background: "linear-gradient(180deg, #111115 0%, #0d0d0f 100%)",
  }}>
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#f0956a", marginBottom: "0.2rem", fontFamily: "'DM Sans', sans-serif" }}>
            Your Week, Your Empire
          </div>
          <h1 style={{ margin: 0, fontSize: "1.9rem", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
            Influencer <em style={{ color: "#f0956a" }}>Weekly</em> Planner
          </h1>
        </div>
        {/* Progress */}
        <div style={{
          background: "#16161c", border: "1px solid #2a2a35",
          borderRadius: 12, padding: "0.75rem 1.25rem", textAlign: "center", minWidth: 140,
        }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#666", marginBottom: "0.3rem" }}>Weekly Progress</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 400, color: "#f0956a" }}>{doneTasks}<span style={{ fontSize: "0.9rem", color: "#555" }}>/{totalInfluencerTasks}</span></div>
          <div style={{ marginTop: "0.4rem", height: 4, background: "#2a2a35", borderRadius: 2 }}>
            <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg,#f0956a,#e86fa0)", width: `${totalInfluencerTasks ? Math.round(doneTasks / totalInfluencerTasks * 100) : 0}%`, transition: "width 0.4s" }} />
          </div>
        </div>
      </div>

      {/* Tip bar */}
      <div style={{
        marginTop: "1rem",
        padding: "0.6rem 1rem",
        background: "rgba(240,149,106,0.07)",
        borderLeft: "3px solid #f0956a",
        borderRadius: "0 6px 6px 0",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.8rem",
        color: "#c07850",
        fontStyle: "italic",
      }}>
        <span key={tipIdx} className="tip-anim" style={{ display: "inline-block" }}>💡 {INFLUENCER_TIPS[tipIdx]}</span>
      </div>
    </div>
  </div>

  <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem 1.5rem 4rem" }}>

    {/* Day Selector */}
    <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
      {DAYS.map((d, i) => {
        const weekend = d === "Sat" || d === "Sun";
        const active = activeDay === d;
        const today = d === todayDayKey;
        return (
          <button key={d} className="day-btn" onClick={() => setActiveDay(d)} style={{
            padding: "0.5rem 0.9rem",
            borderRadius: 8,
            border: active ? "1.5px solid #f0956a" : "1.5px solid #22222c",
            background: active ? "rgba(240,149,106,0.15)" : weekend ? "rgba(232,111,160,0.06)" : "#13131a",
            color: active ? "#f0956a" : weekend ? "#c070a0" : "#888",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.8rem",
            fontWeight: active ? 600 : 400,
            cursor: "pointer",
            position: "relative",
          }}>
            {d}
            {today && <span style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, borderRadius: "50%", background: "#f0956a", border: "2px solid #0d0d0f" }} />}
            {weekend && !active && <span style={{ display: "block", fontSize: "0.55rem", color: "#e86fa0", letterSpacing: "0.05em" }}>FREE</span>}
          </button>
        );
      })}
    </div>

    {/* Day Label */}
    <div className="fade-in" key={activeDay} style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 400 }}>
        {DAY_FULL[DAYS.indexOf(activeDay)]}
        {isToday && <span style={{ marginLeft: "0.6rem", fontSize: "0.65rem", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", color: "#f0956a", background: "rgba(240,149,106,0.12)", padding: "0.15rem 0.5rem", borderRadius: 4, verticalAlign: "middle" }}>Today</span>}
      </h2>
      {isWeekend && (
        <span style={{ fontSize: "0.7rem", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", color: "#e86fa0", background: "rgba(232,111,160,0.1)", padding: "0.2rem 0.6rem", borderRadius: 4 }}>
          🎬 Full Creator Day
        </span>
      )}
    </div>

    {/* Slots */}
    <div className="fade-in" key={activeDay + "slots"} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {SLOTS[activeDay].map(slot => {
        const col = COLORS[slot.type];
        const slotTasks = tasks[activeDay]?.[slot.id] || [];
        const done = slotTasks.filter(t => t.done).length;
        const isActiveSlot = activeSlot === `${activeDay}-${slot.id}`;
        const presets = TASK_PRESETS[presetKey[slot.id]] || TASK_PRESETS[slot.id] || [];

        return (
          <div key={slot.id} className="slot-card" style={{
            background: col.bg,
            border: `1px solid ${col.border}22`,
            borderLeft: `3px solid ${col.border}`,
            borderRadius: 12,
            padding: "1.1rem 1.25rem",
            opacity: slot.locked ? 0.55 : 1,
          }}>
            {/* Slot header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: slot.locked ? 0 : "0.85rem" }}>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 400 }}>{slot.label}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: "#555", letterSpacing: "0.04em", marginTop: "0.1rem" }}>{slot.time}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {!slot.locked && slotTasks.length > 0 && (
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: col.text, background: `${col.border}22`, padding: "0.15rem 0.5rem", borderRadius: 20 }}>
                    {done}/{slotTasks.length} done
                  </span>
                )}
                <span style={{
                  fontSize: "0.62rem", fontFamily: "'DM Sans',sans-serif",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: col.text, background: `${col.border}18`, padding: "0.15rem 0.55rem", borderRadius: 4,
                }}>
                  {slot.type === "influencer" ? "Creator" : "Work"}
                </span>
              </div>
            </div>

            {slot.locked && (
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: "#3a5a8a" }}>
                🔒 Protected work time — stay focused, grind it out.
              </div>
            )}

            {!slot.locked && (
              <>
                {/* Task list */}
                {slotTasks.length > 0 && (
                  <div style={{ marginBottom: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {slotTasks.map(task => (
                      <div key={task.id} className="task-row" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <button className="check-btn" onClick={() => toggleTask(activeDay, slot.id, task.id)} style={{
                          width: 18, height: 18, borderRadius: 4,
                          border: `1.5px solid ${task.done ? col.border : "#333"}`,
                          background: task.done ? col.border : "transparent",
                          cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {task.done && <span style={{ fontSize: "0.6rem", color: "#0d0d0f" }}>✓</span>}
                        </button>
                        <span style={{
                          fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem",
                          color: task.done ? "#444" : "#ccc",
                          textDecoration: task.done ? "line-through" : "none",
                          flex: 1,
                        }}>{task.text}</span>
                        <button className="del-btn" onClick={() => deleteTask(activeDay, slot.id, task.id)} style={{
                          background: "none", border: "none", color: "#444", cursor: "pointer",
                          fontSize: "0.75rem", opacity: 0, padding: "0 0.2rem",
                        }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add task input */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    value={inputs[activeDay]?.[slot.id] || ""}
                    onChange={e => setInputs(prev => ({ ...prev, [activeDay]: { ...prev[activeDay], [slot.id]: e.target.value } }))}
                    onKeyDown={e => e.key === "Enter" && addTask(activeDay, slot.id)}
                    placeholder="Add a task..."
                    style={{
                      flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a35",
                      borderRadius: 6, padding: "0.45rem 0.75rem", color: "#ccc",
                      fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", outline: "none",
                    }}
                  />
                  <button onClick={() => addTask(activeDay, slot.id)} style={{
                    background: col.border, color: "#fff", border: "none", borderRadius: 6,
                    padding: "0.45rem 0.85rem", cursor: "pointer", fontSize: "0.85rem",
                    fontFamily: "'DM Sans',sans-serif",
                  }}>+</button>
                  {presets.length > 0 && (
                    <button onClick={() => setActiveSlot(isActiveSlot ? null : `${activeDay}-${slot.id}`)} style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a35",
                      borderRadius: 6, padding: "0.45rem 0.75rem", cursor: "pointer",
                      color: "#666", fontSize: "0.75rem", fontFamily: "'DM Sans',sans-serif",
                    }}>
                      Ideas ▾
                    </button>
                  )}
                </div>

                {/* Preset chips */}
                {isActiveSlot && presets.length > 0 && (
                  <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {presets.map(p => (
                      <span key={p} className="preset-chip" onClick={() => addPreset(activeDay, slot.id, p)} style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem",
                        padding: "0.25rem 0.65rem", borderRadius: 20,
                        background: "rgba(240,149,106,0.1)", border: "1px solid rgba(240,149,106,0.2)",
                        color: "#c07850",
                      }}>
                        + {p}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>

    {/* Weekly Goals */}
    <div style={{
      marginTop: "2rem",
      background: "#111116",
      border: "1px solid #1e1e28",
      borderRadius: 12,
      padding: "1.25rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 400 }}>🎯 Weekly Goals</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: "#555", marginTop: "0.1rem" }}>What must you achieve this week?</div>
        </div>
        <button onClick={() => setShowGoalInput(v => !v)} style={{
          background: "rgba(240,149,106,0.1)", border: "1px solid rgba(240,149,106,0.2)",
          borderRadius: 6, padding: "0.4rem 0.85rem", cursor: "pointer",
          color: "#f0956a", fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem",
        }}>
          + Add Goal
        </button>
      </div>

      {showGoalInput && (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.85rem" }}>
          <input
            value={goalText}
            onChange={e => setGoalText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addGoal()}
            placeholder="e.g. Hit 1K followers, Post 5 Reels..."
            autoFocus
            style={{
              flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a35",
              borderRadius: 6, padding: "0.5rem 0.75rem", color: "#ccc",
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", outline: "none",
            }}
          />
          <button onClick={addGoal} style={{
            background: "#f0956a", color: "#fff", border: "none", borderRadius: 6,
            padding: "0.5rem 1rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem",
          }}>Set</button>
        </div>
      )}

      {goals.length === 0 ? (
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "#333", fontStyle: "italic", textAlign: "center", padding: "0.75rem" }}>
          No goals yet — add your big wins for this week ✨
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {goals.map(g => (
            <div key={g.id} className="task-row" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <button className="check-btn" onClick={() => setGoals(prev => prev.map(x => x.id === g.id ? { ...x, done: !x.done } : x))} style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `1.5px solid ${g.done ? "#f0956a" : "#333"}`,
                background: g.done ? "#f0956a" : "transparent",
                cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {g.done && <span style={{ fontSize: "0.6rem", color: "#0d0d0f" }}>✓</span>}
              </button>
              <span style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem",
                color: g.done ? "#444" : "#bbb", textDecoration: g.done ? "line-through" : "none", flex: 1,
              }}>{g.text}</span>
              <button className="del-btn" onClick={() => setGoals(prev => prev.filter(x => x.id !== g.id))} style={{
                background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: "0.75rem", opacity: 0,
              }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Weekly Hours Summary */}
    <div style={{
      marginTop: "1rem",
      display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem",
    }}>
      {[
        { label: "Weekday Creator Hrs", value: "10 hrs", sub: "2hrs/day × 5 days", color: "#f0956a" },
        { label: "Weekend Creator Hrs", value: "~14 hrs", sub: "Sat + Sun full days", color: "#e86fa0" },
        { label: "Total Weekly", value: "~24 hrs", sub: "for your journey 🚀", color: "#a07ae8" },
      ].map(s => (
        <div key={s.label} style={{
          background: "#111116", border: "1px solid #1e1e28",
          borderRadius: 10, padding: "0.85rem 1rem", textAlign: "center",
        }}>
          <div style={{ fontSize: "1.3rem", color: s.color, fontWeight: 400 }}>{s.value}</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: "#555", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "0.2rem" }}>{s.label}</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: "#3a3a45", marginTop: "0.15rem" }}>{s.sub}</div>
        </div>
      ))}
    </div>
  </div>
</div>
```

);
}
