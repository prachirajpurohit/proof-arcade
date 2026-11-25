import React,{useEffect,useState} from 'react';import{createRoot}from'react-dom/client';import{ArrowLeft,ArrowRight,RotateCcw,Check,Lock,Lightbulb,Zap,Radio,HeartPulse,Droplets,TrafficCone,Store,Menu,ShieldCheck,AlertTriangle,ChevronRight,Info,Flag,Map,BookOpen,Copy}from'lucide-react';import './style.css';
import AlgorithmDetective from './AlgorithmDetective.jsx';

const energyBudget = 10;
const services = [
  {
    id: 'hospital', name: 'Hospital', cost: 5, icon: HeartPulse,
    detail: 'Emergency care and life-support equipment.',
    online: 'Emergency care and life-support equipment have power.',
    offline: 'Emergency care remains limited.',
  },
  {
    id: 'comms', name: 'Communications', cost: 3, icon: Radio,
    detail: 'Coordinates rescue teams and emergency alerts.',
    online: 'Response teams can coordinate and send emergency alerts.',
    offline: 'Response teams have fewer ways to coordinate and alert residents.',
  },
  {
    id: 'water', name: 'Water supply', cost: 4, icon: Droplets,
    detail: 'Keeps clean water moving across the city.',
    online: 'Pumps can move clean water across the city.',
    offline: 'The city cannot pump clean water to every area.',
  },
  {
    id: 'traffic', name: 'Traffic lights', cost: 2, icon: TrafficCone,
    detail: 'Helps emergency vehicles navigate intersections.',
    online: 'Working signals help emergency vehicles cross intersections.',
    offline: 'Uncontrolled intersections can slow emergency vehicles.',
  },
  {
    id: 'shops', name: 'Shopping district', cost: 3, icon: Store,
    detail: 'Supports non-essential commercial activity.',
    online: 'Local shops have power again.',
    offline: 'Local shops remain without power.',
  },
];

function getOutcome(selection) {
  const online = services.filter(service => selection.includes(service.id));
  const offline = services.filter(service => !selection.includes(service.id));
  const used = online.reduce((total, service) => total + service.cost, 0);
  return { online, offline, used };
}

function Outcome({ selection, title }) {
  const { online, offline, used } = getOutcome(selection);
  return <article className="panel outcome">
    <h3>{title}</h3>
    <p>{used} of {energyBudget} energy units used</p>
    {[['Back online', online, 'online'], ['Still offline', offline, 'offline']].map(([label, group, status]) =>
      <div className="outcome-group" key={status}>
        <h4>{label}</h4>
        <ul>{group.map(service => <li key={service.id}>
          <b>{service.name}</b> <span>{service[status]}</span>
        </li>)}</ul>
      </div>
    )}
  </article>;
}

function Completion({ name, selection, breakdown, onBoard, onReplay }) {
  const [copyStatus, setCopyStatus] = useState('');
  const [showLog, setShowLog] = useState(false);
  const logField = React.useRef(null);
  const { online, offline, used } = getOutcome(selection);
  const log = [
    'Day 1 flag unlocked | Blackout Protocol',
    ...(name.trim() ? ['Name: ' + name.trim()] : []),
    '',
    'My restoration plan',
    'Back online: ' + online.map(service => service.name).join(', '),
    'Still offline: ' + offline.map(service => service.name).join(', '),
    'Energy used: ' + used + ' of ' + energyBudget,
    ...[...online.map(service => service.online), ...offline.map(service => service.offline)].map(effect => '- ' + effect),
    '',
    'My college food delivery app breakdown',
    ...breakdown.map((answer, index) => (index + 1) + '. ' + answer.trim()),
  ].join('\n');

  useEffect(() => {
    if (showLog) {
      logField.current?.focus();
      logField.current?.select();
    }
  }, [showLog]);

  async function copyLog() {
    if (showLog) {
      logField.current?.focus();
      logField.current?.select();
      return;
    }
    try {
      await navigator.clipboard.writeText(log);
      setCopyStatus('Log copied. Paste it into your Proof log.');
    } catch {
      setShowLog(true);
      setCopyStatus('Your log is selected. Use your device’s Copy command to copy it.');
    }
  }

  return <div className="shell done">
    <section className="panel completion-card" aria-labelledby="flag-heading">
      <div className="completion-mark"><Flag size={36} aria-hidden="true"/></div>
      <h1 id="flag-heading">Day 1 flag unlocked</h1>
      <p className="lead">{name.trim() ? name.trim() + ' completed' : 'Mission complete'} · Blackout Protocol</p>
      <div className="completion-details">
        <h2>My restoration plan</h2>
        <p><b>Back online:</b> {online.map(service => service.name).join(', ')}<br/>
          <b>Energy used:</b> {used} of {energyBudget}</p>
        <h2>My college food delivery app breakdown</h2>
        <ol>{breakdown.map((answer, index) => <li key={index}>{answer.trim()}</li>)}</ol>
      </div>
    </section>
    <div className="done-actions">
      <button className="primary" onClick={copyLog}><Copy size={17}/> {showLog ? 'Select my log' : 'Copy my log'}</button>
      <button className="secondary" onClick={onReplay}><RotateCcw size={17}/> Replay Day 1</button>
      <button className="secondary" onClick={onBoard}><Map size={18}/> Mission board</button>
    </div>
    <p className="fine" role="status">{copyStatus || 'Paste your log into Proof or take a screenshot of your flag card.'}</p>
    {showLog && <textarea className="log-field" ref={logField} readOnly value={log} rows={10} aria-label="Your Day 1 log"/>}
  </div>;
}

const days=[['01','Blackout Protocol','Break big problems into smaller ones'],['02','Algorithm Detective','Find better ways to solve a puzzle'],['03','Bug Hunters','Track down what went wrong'],['04','Behind the Internet','Follow a request across the web'],['05','Build Something Ridiculous','Design a tiny working system'],['06','Engineering Showdown','Defend your design choices'],['07','The Final Boss','Put everything together']];
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
function City({active=[],onSelect,selected}){return <div className="city" aria-label="Illustrated city map"><svg viewBox="0 0 820 385" role="img" aria-label="Nighttime city with five selectable buildings"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#132c4b"/><stop offset="1" stopColor="#0b182a"/></linearGradient><linearGradient id="roof" x1="0" x2="1"><stop stopColor="#3a5776"/><stop offset="1" stopColor="#172b44"/></linearGradient></defs><rect width="820" height="385" fill="url(#sky)"/><circle cx="694" cy="55" r="25" fill="#d7e7ee" opacity=".75"/><path d="M0 290L200 215L440 280L640 208L820 275V385H0Z" fill="#102239"/><path d="M0 342L235 259L550 365M180 385L560 232L820 326" stroke="#34516b" strokeWidth="30"/><path d="M0 342L235 259L550 365M180 385L560 232L820 326" stroke="#e6ad62" strokeWidth="2" strokeDasharray="10 18" opacity=".5"/>{[[105,170,90,130],[247,115,125,176],[440,150,105,132],[610,112,105,177],[715,207,68,99]].map(([x,y,w,h],i)=>{let id=services[i].id,lit=active.includes(id);return <g key={id} onClick={()=>onSelect?.(id)} className={onSelect?'building clickable':''} tabIndex={onSelect?0:undefined} role={onSelect?'button':undefined} aria-label={services[i].name} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')onSelect?.(id)}}><rect x={x} y={y} width={w} height={h} rx="5" fill={lit?'#21596a':'#1c344f'} stroke={selected===id?'#ffcd7c':lit?'#63dec9':'#4b6783'} strokeWidth={selected===id?4:2}/><path d={`M${x} ${y}l20 -16h${w}l-20 16Z`} fill="url(#roof)"/><path d={`M${x+w} ${y}l20 -16v${h}l-20 16Z`} fill="#11263b"/>{Array.from({length:Math.floor(w/22)*Math.floor(h/31)},(_,j)=>{let cols=Math.floor(w/22),xx=x+11+(j%cols)*22,yy=y+16+Math.floor(j/cols)*31;return <rect key={j} x={xx} y={yy} width="9" height="13" rx="1" fill={lit?'#f8d78c':'#54718c'} opacity={lit?.9:.35}/>})}<circle cx={x+w/2} cy={y-24} r="15" fill={lit?'#64e6c6':'#1a344d'} stroke={lit?'#64e6c6':'#7691aa'} strokeWidth="2"/><text x={x+w/2} y={y-19} textAnchor="middle" fontSize="17" fill="#fff">{['+','⌁','≈','↔','◇'][i]}</text><text x={x+w/2} y={y+h+23} textAnchor="middle" fill="#e5effb" fontSize="13" fontWeight="600">{['HOSPITAL','COMMS','WATER','TRAFFIC','SHOPS'][i]}</text></g>})}</svg><div className="city-caption">{onSelect?'SELECT A BUILDING TO INVESTIGATE':'THE CITY IS WAITING FOR YOUR PLAN'}</div></div>}
function App() {
  const [name, setName] = useState(() => read('proof7-name', ''));
  const [screen, setScreen] = useState(() => read('proof7-name', '') ? 'hub' : 'welcome');
  const [stage, setStage] = useState(0);
  const [visited, setVisited] = useState([]);
  const [focus, setFocus] = useState('hospital');
  const [chosen, setChosen] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [breakdown, setBreakdown] = useState(['', '', '']);
  const [hint, setHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(() => read('proof7-completed', false));
  const [day2Completed, setDay2Completed] = useState(() => read('proof7-day2-completed', false));
  const [showGuide, setShowGuide] = useState(false);
  const { used } = getOutcome(chosen);
  const missionActions = [start, () => setScreen('day2')];
  const missionCompletions = [completed, day2Completed];
  const completedCount = missionCompletions.filter(Boolean).length;

  useEffect(() => { localStorage.setItem('proof7-name', JSON.stringify(name)); }, [name]);
  useEffect(() => { localStorage.setItem('proof7-completed', JSON.stringify(completed)); }, [completed]);
  useEffect(() => { localStorage.setItem('proof7-day2-completed', JSON.stringify(day2Completed)); }, [day2Completed]);

  function start() {
    setStage(0);
    setVisited([]);
    setFocus('hospital');
    setChosen([]);
    setAttempts([]);
    setBreakdown(['', '', '']);
    setHint(false);
    setFeedback('');
    setScreen('mission');
  }

  function next() {
    setFeedback('');
    setHint(false);
    setStage(current => current + 1);
  }

  function toggle(service) {
    setChosen(current => {
      if (current.includes(service.id)) return current.filter(id => id !== service.id);
      if (getOutcome(current).used + service.cost > energyBudget) return current;
      return [...current, service.id];
    });
    setFeedback('');
  }

  function submitPlan() {
    if (!chosen.length) {
      setFeedback('Choose at least one service to restore.');
      return;
    }
    setAttempts(current => {
      const latest = current.at(-1);
      if (latest?.length === chosen.length && chosen.every(id => latest.includes(id))) return current;
      return [...current.slice(-1), chosen];
    });
    next();
  }

  function complete() {
    setCompleted(true);
    setScreen('done');
  }

  return <div className="app"><header className="top"><button className="brand" onClick={()=>setScreen('hub')} aria-label="Go to mission selection"><span className="brand-icon">✳</span> PROOF <span className="brand-muted">/ 7 DAYS</span></button><div className="header-right"><span className="season">SEASON 01</span>{name&&<span className="user-pill"><span className="user-dot"/>{name}</span>}</div></header><main>{screen==='welcome'&&<div className="welcome shell"><div className="eyebrow"><span className="pulse"/> THE ENGINEERING ADVENTURE BEGINS</div><h1>Seven days.<br/><em>Seven missions.</em><br/>One curious mind.</h1><p className="lead">A little challenge every day. No grades, no pressure—just experiments, discoveries, and the satisfaction of figuring things out.</p><form className="welcome-form" onSubmit={e=>{e.preventDefault();if(name.trim())setScreen('hub')}}><label htmlFor="student">WHAT SHOULD WE CALL YOU?</label><div className="form-line"><input id="student" value={name} onChange={e=>setName(e.target.value.slice(0,35))} placeholder="Your first name" maxLength={35} required/><button className="primary" type="submit">Enter the adventure <ArrowRight size={18}/></button></div></form><p className="fine">No account needed. Your name and completed mission are remembered only on this browser.</p><div className="welcome-art"><City/></div></div>}
{screen === 'hub' && <div className="shell hub">
  <div className="eyebrow">YOUR MISSION BOARD</div>
  <div className="hub-head">
    <div><h1>Ready, <em>{name || 'engineer'}?</em></h1><p className="lead">Pick up where you left off, or replay a mission whenever you like.</p></div>
    <div className="progress-chip">{String(completedCount).padStart(2, '0')} / 07 COMPLETE</div>
  </div>
  <div className="day-grid">{days.map(([number, title, description], index) => {
    const play = missionActions[index];
    const finished = missionCompletions[index];
    return <button key={number} className={'day-card ' + (play ? 'available' : 'locked')} onClick={play} disabled={!play}>
      <div className="day-card-top"><span>DAY {number}</span>{play ? <span className="live">{finished ? 'REPLAY ANYTIME' : 'PLAY NOW'}</span> : <Lock size={16}/>}</div>
      <div className="day-symbol">{index === 0 ? <Zap size={32}/> : ['', '⌘', '{ }', '◎', '⚙', '◇', '★'][index]}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="day-foot">{play ? <>{finished ? 'Mission completed — play again' : 'Start mission'} <ArrowRight size={16}/></> : 'COMING SOON'}</div>
    </button>;
  })}</div>
  <p className="fine hub-note">New missions will be added throughout the week. Previous missions stay available to replay.</p>
</div>}
{screen === 'day2' && <AlgorithmDetective onBoard={() => setScreen('hub')} onComplete={() => setDay2Completed(true)}/>}
{screen==='mission'&&<div className="shell mission"><div className="mission-top"><button className="back" onClick={()=>setScreen('hub')}><ArrowLeft size={16}/> Mission board</button><span className="mission-label">DAY 01 <span> / </span> BLACKOUT PROTOCOL</span><button className="back" onClick={()=>setShowGuide(!showGuide)}><Info size={16}/> Help</button></div>{showGuide&&<div className="help"><b>How to play:</b> Explore the city, try different restoration plans, and compare what happens. Bring your reasoning to class. When you finish, you can copy your answers into your Proof log.</div>}<div className="stepper">{['Briefing','Investigate','Plan','Outcome','Break it down'].map((s,i)=><div key={s} className={'step '+(stage===i?'current':stage>i?'past':'')}><span>{stage>i?<Check size={12}/>:i+1}</span><small>{s}</small></div>)}</div>
{stage===0&&<div className="two-col"><div className="story"><div className="eyebrow amber"><AlertTriangle size={15}/> EMERGENCY TRANSMISSION</div><h1>The city<br/>has gone <em>dark.</em></h1><p>A sudden blackout has cut power to five city services. You're the emergency engineer on duty.</p><p>You've got <strong>10 energy units</strong>—but restoring everything would require 17. You'll need to investigate, prioritize, and rethink your plan when new information arrives.</p><div className="brief-box"><span>YOUR OBJECTIVE</span><b>Make a plan you can explain.</b><small>Take your time. Explore, experiment, and explain why.</small></div><button className="primary" onClick={next}>Begin investigation <ArrowRight size={18}/></button></div><City/></div>}
{stage===1&&<><div className="stage-heading"><div className="eyebrow">PHASE 01 / INVESTIGATE</div><h2>What are we dealing with?</h2><p>Click each building to inspect its purpose and energy cost. Find all five before continuing.</p></div><div className="two-col investigation"><City onSelect={id=>{setFocus(id);setVisited(v=>v.includes(id)?v:[...v,id])}} selected={focus}/><div className="panel"><div className="eyebrow">SYSTEM INSPECTOR</div>{(()=>{let s=services.find(v=>v.id===focus),Icon=s.icon;return <><div className="inspector-icon"><Icon size={28}/></div><h3>{s.name}</h3><p>{s.detail}</p><div className="stat-line"><span>Restoration cost</span><b>{s.cost} energy units</b></div><div className="stat-line"><span>Investigation</span><b>{visited.includes(s.id)?'Inspected':'Not yet inspected'}</b></div></>})()}<div className="discovered"><span>{visited.length} / 5 SYSTEMS INVESTIGATED</span><div className="meter"><div style={{width:`${visited.length*20}%`}}/></div></div><button className="primary full" disabled={visited.length<5} onClick={next}>Create your plan <ArrowRight size={18}/></button></div></div></>}
{stage === 2 && <>
  <div className="stage-heading">
    <div className="eyebrow">PHASE 02 / FIRST RESPONSE</div>
    <h2>Choose what to restore.</h2>
    <p>You have {energyBudget} energy units. Select the services you'd restore first.</p>
  </div>
  <div className="two-col">
    <div className="panel">
      <div className="budget">
        <span>AVAILABLE ENERGY</span>
        <strong aria-live="polite">{energyBudget - used}<small> / {energyBudget} remaining</small></strong>
        <div className="meter" aria-hidden="true"><div style={{ width: (used / energyBudget) * 100 + '%' }}/></div>
      </div>
      <div className="service-list">
        {services.map(service => {
          const Icon = service.icon;
          const checked = chosen.includes(service.id);
          return <button key={service.id} className={'service ' + (checked ? 'picked' : '')}
            onClick={() => toggle(service)} aria-pressed={checked} disabled={!checked && used + service.cost > energyBudget}>
            <span className="service-icon"><Icon size={20} aria-hidden="true"/></span>
            <span className="service-name"><b>{service.name}</b><small>{service.detail}</small></span>
            <span className="service-cost">{service.cost} energy</span>
            <span className="select-mark" aria-hidden="true">{checked ? <Check size={15}/> : '+'}</span>
          </button>;
        })}
      </div>
    </div>
    <div className="panel">
      <div className="eyebrow">CLASS DISCUSSION</div>
      <h3>Why this plan?</h3>
      <p>Be ready to explain one service you restored and one you left offline.</p>
      <button className="hint" onClick={() => setHint(!hint)} aria-expanded={hint}>
        <Lightbulb size={16}/> {hint ? 'Hide thinking prompt' : 'Need a thinking prompt?'}
      </button>
      {hint && <div className="hint-box">Who benefits from your choices right away? Who still needs help?</div>}
      {feedback && <div className="feedback" role="status"><Info size={18}/>{feedback}</div>}
      <button className="primary full" onClick={submitPlan}>See what happens <ArrowRight size={18}/></button>
    </div>
  </div>
</>}
{stage === 3 && <>
  <div className="stage-heading">
    <div className="eyebrow">PHASE 03 / MISSION OUTCOME</div>
    <h2>What did your plan change?</h2>
    <p>{attempts.length > 1
      ? 'Compare the two plans. Which would you choose if immediate safety were your priority?'
      : 'See what came back online and who still needs help. Try another strategy to compare the outcomes.'}</p>
  </div>
  <div className={attempts.length > 1 ? 'two-col' : ''}>
    <Outcome selection={attempts.at(-1)} title="Your latest plan"/>
    {attempts.length > 1 && <Outcome selection={attempts[0]} title="Your previous plan"/>}
  </div>
  <div className="outcome-actions">
    <button className="secondary" onClick={() => setStage(2)}><RotateCcw size={17}/> Try another strategy</button>
    <button className="primary" onClick={next}>Continue to the final challenge <ArrowRight size={18}/></button>
  </div>
</>}
{stage===4&&<><div className="stage-heading"><div className="eyebrow">PHASE 04 / TRANSFER THE SKILL</div><h2>Now break down a new problem.</h2><p>Imagine you're building a food delivery app for your college. No code, no design, no team. What smaller problems must you solve first?</p></div><div className="two-col"><div className="panel"><div className="transfer-illustration" aria-hidden="true"><span>🍔</span><span>→</span><span>📱</span><span>→</span><span>🚲</span></div><h3>The real engineering trick</h3><p>Large problems become manageable when you identify smaller tasks, their constraints, and what depends on what.</p><div className="concept"><BookOpen size={18}/><div><b>Problem decomposition</b><small>Break a complex problem into smaller, actionable pieces.</small></div></div></div><div className="panel explanation"><div className="eyebrow">YOUR FINAL NOTEBOOK TASK</div><h3>List three smaller problems</h3>{breakdown.map((v,i)=><label className="answer-field" key={i}><span>SUBPROBLEM {i+1}</span><input value={v} onChange={e=>setBreakdown(old=>old.map((x,j)=>i===j?e.target.value:x))} placeholder={['What has to happen first?','What needs to happen next?','What might depend on another task?'][i]}/></label>)}{feedback&&<div className="feedback"><Info size={18}/>{feedback}</div>}<button className="primary full" onClick={()=>{if(breakdown.some(v=>v.trim().length<8)){setFeedback('Write a meaningful idea for each of the three smaller problems.');return}complete()}}>Complete Day 1 <Flag size={18}/></button></div></div></>}
</div>}
{screen === 'done' && <Completion name={name} selection={chosen} breakdown={breakdown}
  onBoard={() => setScreen('hub')} onReplay={start}/>}</main><footer><span>PROOF / 7 DAYS</span><span>THINK · EXPERIMENT · DISCOVER</span></footer></div>}
createRoot(document.getElementById('root')).render(<App/>);
