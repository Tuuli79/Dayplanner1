import { useState, useEffect, useCallback } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&family=Jost:wght@200;300;400&display=swap');`;

const HOURS = ["6 AM","7 AM","8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM"];
const QUOTES = [
  "The secret of getting ahead is getting started.",
  "Do something today your future self will thank you for.",
  "Small steps every day lead to big changes.",
  "Focus on progress, not perfection.",
  "You have exactly the right amount of time for what matters most.",
];

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(date) {
  const d = new Date(date);
  return {
    day: d.getDate(),
    month: d.toLocaleString("default", { month: "long" }).toUpperCase(),
    year: d.getFullYear(),
    weekday: d.toLocaleString("default", { weekday: "long" }).toUpperCase(),
  };
}

const defaultState = () => ({
  priorities: ["", "", ""],
  priorityDone: [false, false, false],
  timeBlocks: Object.fromEntries(HOURS.map(h => [h, ""])),
  brainDump: "",
  intention: "",
  habits: ["", "", "", ""],
  habitDone: [false, false, false, false],
  mood: 4,
  energy: 5,
  focus: 3,
  water: 0,
  gratitude: ["", "", ""],
  wordOfDay: "",
  todayWin: "",
  quote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
});

export default function Dashboard() {
  const todayKey = getTodayKey();
  const dateInfo = formatDate(todayKey);
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`dashboard:${todayKey}`);
      if (stored) setState(JSON.parse(stored));
    } catch (_) {}
    setLoaded(true);
  }, []);

  // Save to localStorage
  const save = useCallback((newState) => {
    try {
      localStorage.setItem(`dashboard:${todayKey}`, JSON.stringify(newState));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (_) {}
  }, [todayKey]);

  const update = (patch) => {
    setState(prev => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  };

  const setPriority = (i, val) => {
    const p = [...state.priorities]; p[i] = val; update({ priorities: p });
  };
  const togglePriority = (i) => {
    const d = [...state.priorityDone]; d[i] = !d[i]; update({ priorityDone: d });
  };
  const setTimeBlock = (h, val) => {
    update({ timeBlocks: { ...state.timeBlocks, [h]: val } });
  };
  const setHabit = (i, val) => {
    const h = [...state.habits]; h[i] = val; update({ habits: h });
  };
  const toggleHabit = (i) => {
    const d = [...state.habitDone]; d[i] = !d[i]; update({ habitDone: d });
  };
  const setGratitude = (i, val) => {
    const g = [...state.gratitude]; g[i] = val; update({ gratitude: g });
  };

  if (!loaded) return (
    <div style={{ background: "#2C2820", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "Georgia, serif", color: "#8C8478", fontSize: 14, letterSpacing: "0.2em" }}>Loading...</div>
    </div>
  );

  const completedPriorities = state.priorityDone.filter(Boolean).length;
  const completedHabits = state.habitDone.filter(Boolean).length;
  const filledBlocks = Object.values(state.timeBlocks).filter(v => v.trim()).length;

  return (
    <>
      <style>{FONTS}{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --cream: #F5F0E8; --warm: #FAF7F2; --ink: #1C1A17; --charcoal: #3A3630;
          --muted: #8C8478; --rule: #D4CCBC; --accent: #B85C38; --accent-l: #E8C4B4;
          --sage: #7A8C72; --sage-l: #C4D0BF; --gold: #C4952A; --gold-l: #EAD89A;
        }
        body { background: #2C2820; }
        textarea, input { font-family: 'Jost', sans-serif; resize: none; border: none; background: transparent; outline: none; color: var(--ink); font-size: 11px; width: 100%; }
        textarea::placeholder, input::placeholder { color: var(--rule); }
        .page { width: 820px; min-height: 1060px; background: var(--cream); position: relative; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,.5); }
        .accent-bar { height: 3px; background: linear-gradient(90deg, var(--accent) 0%, var(--accent-l) 40%, var(--sage-l) 70%, var(--gold-l) 100%); }
        .corner { position: absolute; width: 28px; height: 28px; }
        .corner.tl { top:20px; left:20px; border-top:1.5px solid var(--accent); border-left:1.5px solid var(--accent); }
        .corner.tr { top:20px; right:20px; border-top:1.5px solid var(--accent); border-right:1.5px solid var(--accent); }
        .corner.bl { bottom:20px; left:20px; border-bottom:1.5px solid var(--accent); border-left:1.5px solid var(--accent); }
        .corner.br { bottom:20px; right:20px; border-bottom:1.5px solid var(--accent); border-right:1.5px solid var(--accent); }
        .header { padding: 40px 52px 24px; display:flex; justify-content:space-between; align-items:flex-end; border-bottom:1px solid var(--rule); }
        .h-title { font-family:'Cormorant Garamond',serif; font-size:50px; font-weight:300; color:var(--ink); line-height:1; }
        .h-title em { font-style:italic; color:var(--accent); }
        .h-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
        .date-num { font-family:'Cormorant Garamond',serif; font-size:60px; font-weight:300; color:var(--ink); line-height:1; text-align:right; }
        .date-meta { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:.2em; color:var(--muted); text-transform:uppercase; text-align:right; }
        .content { display:grid; grid-template-columns:1fr 240px; }
        .col-l { padding:24px 28px 24px 52px; border-right:1px solid var(--rule); display:flex; flex-direction:column; gap:22px; }
        .col-r { padding:24px 52px 24px 24px; display:flex; flex-direction:column; gap:20px; }
        .sec-hdr { display:flex; align-items:center; gap:9px; margin-bottom:10px; }
        .sec-num { font-family:'DM Mono',monospace; font-size:8px; letter-spacing:.15em; color:var(--accent); }
        .sec-title { font-family:'Jost',sans-serif; font-size:9px; font-weight:300; letter-spacing:.3em; text-transform:uppercase; color:var(--charcoal); }
        .sec-line { flex:1; height:1px; background:var(--rule); }
        .tag { font-family:'DM Mono',monospace; font-size:7px; letter-spacing:.12em; text-transform:uppercase; padding:2px 6px; border-radius:2px; }
        .tag-a { background:var(--accent-l); color:var(--accent); }
        .tag-s { background:var(--sage-l); color:var(--sage); }
        .pri-item { display:flex; align-items:center; gap:10px; padding:7px 0; border-bottom:1px solid var(--rule); }
        .pri-item:last-child { border-bottom:none; }
        .pri-rank { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:300; color:var(--accent-l); min-width:14px; }
        .check-btn { width:15px; height:15px; border:1.5px solid var(--rule); flex-shrink:0; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
        .check-btn.done { border-color:var(--accent); background:var(--accent); }
        .check-btn.done::after { content:'✓'; font-size:9px; color:white; font-weight:bold; }
        .pri-input { font-size:11px; color:var(--ink); border-bottom:1px solid var(--rule); padding-bottom:2px; }
        .pri-input.done-text { text-decoration:line-through; color:var(--muted); }
        .time-row { display:grid; grid-template-columns:40px 1fr; border-bottom:1px solid var(--rule); min-height:26px; }
        .time-lbl { font-family:'DM Mono',monospace; font-size:8px; color:var(--muted); padding:7px 0 5px; display:flex; align-items:flex-start; }
        .time-inp { padding:6px 0 4px 4px; font-size:11px; border-left:2px solid transparent; transition:border-color .15s; }
        .time-inp:focus { border-left-color:var(--accent); }
        .slider-row { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
        .slider-lbl { font-family:'DM Mono',monospace; font-size:8px; letter-spacing:.1em; color:var(--muted); width:48px; text-transform:uppercase; }
        .slider-val { font-family:'DM Mono',monospace; font-size:9px; color:var(--accent); min-width:14px; text-align:right; }
        input[type=range] { flex:1; height:3px; cursor:pointer; -webkit-appearance:none; appearance:none; border-radius:2px; background:var(--rule); outline:none; }
        input[type=range].mood::-webkit-slider-thumb { -webkit-appearance:none; width:11px; height:11px; border-radius:50%; background:var(--accent); cursor:pointer; }
        input[type=range].energy::-webkit-slider-thumb { -webkit-appearance:none; width:11px; height:11px; border-radius:50%; background:var(--sage); cursor:pointer; }
        input[type=range].focus-s::-webkit-slider-thumb { -webkit-appearance:none; width:11px; height:11px; border-radius:50%; background:var(--gold); cursor:pointer; }
        .cup-grid { display:flex; flex-wrap:wrap; gap:5px; }
        .cup { width:22px; height:26px; border:1.5px solid var(--rule); border-top:none; border-radius:0 0 4px 4px; cursor:pointer; position:relative; transition:background .15s,border-color .15s; }
        .cup::before { content:''; position:absolute; top:-5px; left:-1px; right:-1px; height:5px; border:1.5px solid var(--rule); border-bottom:none; border-radius:2px 2px 0 0; }
        .cup.filled { background:var(--accent-l); border-color:var(--accent); }
        .cup.filled::before { border-color:var(--accent); }
        .habit-row { display:flex; align-items:center; gap:8px; padding-bottom:7px; border-bottom:1px solid var(--rule); }
        .habit-row:last-child { border-bottom:none; }
        .habit-check { width:13px; height:13px; border:1.5px solid var(--rule); border-radius:50%; cursor:pointer; flex-shrink:0; transition:all .15s; display:flex; align-items:center; justify-content:center; }
        .habit-check.done { border-color:var(--sage); background:var(--sage); }
        .habit-check.done::after { content:'✓'; font-size:7px; color:white; font-weight:bold; }
        .lined-ta { line-height:24px; background-image: repeating-linear-gradient(transparent, transparent 23px, var(--rule) 23px, var(--rule) 24px); padding-top:2px; font-size:11px; color:var(--ink); }
        .footer { border-top:1px solid var(--rule); padding:16px 52px; display:flex; justify-content:space-between; align-items:flex-start; }
        .footer-quote { font-family:'Cormorant Garamond',serif; font-size:11px; font-style:italic; color:var(--muted); max-width:300px; line-height:1.6; }
        .win-lbl { font-family:'DM Mono',monospace; font-size:8px; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
        .prog-bar { height:3px; background:var(--rule); border-radius:2px; overflow:hidden; margin-top:5px; }
        .prog-fill { height:100%; border-radius:2px; transition:width .4s ease; }
        .save-badge { position:fixed; bottom:24px; right:24px; background:var(--sage); color:white; font-family:'DM Mono',monospace; font-size:9px; letter-spacing:.15em; padding:6px 12px; border-radius:2px; opacity:0; transition:opacity .3s; pointer-events:none; }
        .save-badge.show { opacity:1; }
        .wrap { display:flex; justify-content:center; align-items:flex-start; min-height:100vh; background:#2C2820; padding:36px 20px; font-family:'Jost',sans-serif; }
      `}</style>

      <div className="wrap">
        <div className="page">
          <div className="accent-bar" />
          <div className="corner tl" /><div className="corner tr" />
          <div className="corner bl" /><div className="corner br" />

          <div className="header">
            <div>
              <div className="h-label">Daily Planner · {dateInfo.weekday}</div>
              <div className="h-title">Today's <em>Focus</em></div>
            </div>
            <div>
              <div className="date-num">{dateInfo.day}</div>
              <div className="date-meta">{dateInfo.month} · {dateInfo.year}</div>
            </div>
          </div>

          <div className="content">
            <div className="col-l">

              <div>
                <div className="sec-hdr">
                  <span className="sec-num">01</span>
                  <span className="sec-title">Top Priorities</span>
                  <div className="sec-line" />
                  <span className="tag tag-a">Must Do</span>
                </div>
                {state.priorities.map((p, i) => (
                  <div className="pri-item" key={i}>
                    <div className="pri-rank">{i + 1}</div>
                    <div className={`check-btn${state.priorityDone[i] ? " done" : ""}`} onClick={() => togglePriority(i)} />
                    <input
                      className={`pri-input${state.priorityDone[i] ? " done-text" : ""}`}
                      value={p}
                      onChange={e => setPriority(i, e.target.value)}
                      placeholder={`Priority ${i + 1}...`}
                    />
                  </div>
                ))}
                <div className="prog-bar" style={{ marginTop: 8 }}>
                  <div className="prog-fill" style={{ width: `${(completedPriorities / 3) * 100}%`, background: "var(--accent)" }} />
                </div>
              </div>

              <div>
                <div className="sec-hdr">
                  <span className="sec-num">02</span>
                  <span className="sec-title">Time Blocks</span>
                  <div className="sec-line" />
                  <span className="tag tag-s">Schedule</span>
                </div>
                {HOURS.map(h => (
                  <div className="time-row" key={h}>
                    <div className="time-lbl">{h}</div>
                    <input className="time-inp" value={state.timeBlocks[h]} onChange={e => setTimeBlock(h, e.target.value)} placeholder="—" />
                  </div>
                ))}
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${(filledBlocks / HOURS.length) * 100}%`, background: "var(--sage)" }} />
                </div>
              </div>

              <div>
                <div className="sec-hdr">
                  <span className="sec-num">03</span>
                  <span className="sec-title">Brain Dump</span>
                  <div className="sec-line" />
                </div>
                <textarea className="lined-ta" rows={5} value={state.brainDump} onChange={e => update({ brainDump: e.target.value })} placeholder="Clear your mind here..." />
              </div>

            </div>

            <div className="col-r">

              <div>
                <div className="sec-hdr">
                  <span className="sec-num">04</span>
                  <span className="sec-title">Intention</span>
                  <div className="sec-line" />
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, fontStyle: "italic", color: "var(--muted)", marginBottom: 6 }}>Today I choose to...</div>
                <textarea className="lined-ta" rows={3} value={state.intention} onChange={e => update({ intention: e.target.value })} placeholder="Set your intention..." />
              </div>

              <div>
                <div className="sec-hdr">
                  <span className="sec-num">05</span>
                  <span className="sec-title">Habits</span>
                  <div className="sec-line" />
                </div>
                {state.habits.map((h, i) => (
                  <div className="habit-row" key={i}>
                    <div className={`habit-check${state.habitDone[i] ? " done" : ""}`} onClick={() => toggleHabit(i)} />
                    <input
                      value={h}
                      onChange={e => setHabit(i, e.target.value)}
                      placeholder="Add habit..."
                      style={{ fontSize: 10, color: state.habitDone[i] ? "var(--muted)" : "var(--ink)", textDecoration: state.habitDone[i] ? "line-through" : "none", borderBottom: "1px solid var(--rule)" }}
                    />
                  </div>
                ))}
                <div className="prog-bar" style={{ marginTop: 8 }}>
                  <div className="prog-fill" style={{ width: `${(completedHabits / 4) * 100}%`, background: "var(--sage)" }} />
                </div>
              </div>

              <div>
                <div className="sec-hdr">
                  <span className="sec-num">06</span>
                  <span className="sec-title">Check-in</span>
                  <div className="sec-line" />
                </div>
                {[
                  { key: "mood", label: "Mood", cls: "mood", color: "var(--accent)" },
                  { key: "energy", label: "Energy", cls: "energy", color: "var(--sage)" },
                  { key: "focus", label: "Focus", cls: "focus-s", color: "var(--gold)" },
                ].map(({ key, label, cls, color }) => (
                  <div className="slider-row" key={key}>
                    <div className="slider-lbl">{label}</div>
                    <input
                      type="range" min={1} max={10}
                      className={cls}
                      value={state[key]}
                      onChange={e => update({ [key]: +e.target.value })}
                      style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${(state[key] - 1) / 9 * 100}%, var(--rule) ${(state[key] - 1) / 9 * 100}%)` }}
                    />
                    <div className="slider-val">{state[key]}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="sec-hdr">
                  <span className="sec-num">07</span>
                  <span className="sec-title">Hydration</span>
                  <div className="sec-line" />
                </div>
                <div className="cup-grid">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`cup${i < state.water ? " filled" : ""}`} onClick={() => update({ water: i < state.water ? i : i + 1 })} />
                  ))}
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "var(--muted)", letterSpacing: ".1em", marginTop: 5 }}>
                  {state.water} / 8 glasses
                </div>
              </div>

              <div>
                <div className="sec-hdr">
                  <span className="sec-num">08</span>
                  <span className="sec-title">Grateful For</span>
                  <div className="sec-line" />
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, fontStyle: "italic", color: "var(--muted)", marginBottom: 6 }}>Three things today...</div>
                {state.gratitude.map((g, i) => (
                  <input key={i} value={g} onChange={e => setGratitude(i, e.target.value)} placeholder={`${i + 1}.`}
                    style={{ display: "block", fontSize: 11, color: "var(--ink)", borderBottom: "1px solid var(--rule)", paddingBottom: 4, marginBottom: 6, width: "100%" }} />
                ))}
              </div>

              <div>
                <div className="sec-hdr">
                  <span className="sec-num">09</span>
                  <span className="sec-title">Word of Day</span>
                  <div className="sec-line" />
                </div>
                <input value={state.wordOfDay} onChange={e => update({ wordOfDay: e.target.value })} placeholder="Your focus word..."
                  style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: "italic", color: "var(--ink)", borderBottom: "1px solid var(--rule)", paddingBottom: 4, width: "100%" }} />
              </div>

            </div>
          </div>

          <div className="footer">
            <div className="footer-quote">"{state.quote}"</div>
            <div style={{ width: 200 }}>
              <div className="win-lbl">Today's Win</div>
              <textarea className="lined-ta" rows={3} value={state.todayWin} onChange={e => update({ todayWin: e.target.value })} placeholder="What went well..." style={{ width: "100%" }} />
            </div>
          </div>

        </div>
      </div>

      <div className={`save-badge${saved ? " show" : ""}`}>Saved ✓</div>
    </>
  );
}
