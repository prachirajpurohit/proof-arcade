import React, { useState } from 'react';
import { ArrowLeft, Check, Flag, RotateCcw } from 'lucide-react';

const lockerIds = [12, 17, 23, 29, 34, 41, 46, 52, 59, 65, 71, 78, 82, 91, 97];
const target = 82;
const stages = ['Scan in order', 'Halve the search', 'Compare'];

export default function AlgorithmDetective({ onBoard, onComplete }) {
  const [scanned, setScanned] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [range, setRange] = useState([0, lockerIds.length - 1]);
  const [answer, setAnswer] = useState('');
  const [done, setDone] = useState(false);

  const lastScanned = lockerIds[scanned - 1];
  const lastGuess = guesses.at(-1);
  const [first, last] = range;
  const stage = lastGuess === target ? 2 : lastScanned === target ? 1 : 0;

  function inspect(index) {
    const id = lockerIds[index];
    setGuesses(previous => [...previous, id]);
    if (id < target) setRange([index + 1, last]);
    if (id > target) setRange([first, index - 1]);
  }

  function replay() {
    setScanned(0);
    setGuesses([]);
    setRange([0, lockerIds.length - 1]);
    setAnswer('');
    setDone(false);
  }

  if (done) {
    return <section className="shell done">
      <div className="completion-mark"><Check size={45} aria-hidden="true"/></div>
      <h1>Day 2 flag unlocked</h1>
      <p className="lead">You found the locker twice and saw how a sorted list helps you rule out several options with one check.</p>
      <div className="outcome-actions">
        <button className="primary" onClick={onBoard}>Back to mission board</button>
        <button className="secondary" onClick={replay}><RotateCcw size={17} aria-hidden="true"/> Replay Day 2</button>
      </div>
    </section>;
  }

  return <section className="shell mission">
    <div className="mission-top">
      <button className="back" onClick={onBoard}><ArrowLeft size={16} aria-hidden="true"/> Mission board</button>
      <span className="mission-label">DAY 02 <span> / </span> ALGORITHM DETECTIVE</span>
    </div>
    <div className="stepper" aria-label="Mission progress">
      {stages.map((label, index) => <div key={label}
        className={'step ' + (index === stage ? 'current' : index < stage ? 'past' : '')}
        aria-current={index === stage ? 'step' : undefined}>
        <span>{index + 1}</span><small>{label}</small>
      </div>)}
    </div>
    <div className="stage-heading">
      <h2>{stage === 2 ? 'Why does the order matter?' : `Find locker ${target}`}</h2>
      <p>{stage === 0 && 'A message is waiting in a numbered locker. Start at the first locker and check one number at a time.'}
        {stage === 1 && 'Find the same locker again. Start in the middle of the remaining lockers. Each check tells you which side to search next.'}
        {stage === 2 && 'Compare how many checks each approach took, then decide when you could use the second method.'}</p>
    </div>
    {stage < 2 ? <div className="panel">
      <ul className="locker-grid" aria-label="Locker numbers">
        {lockerIds.map((id, index) => <li key={id} className={stage === 0 && index < scanned ? 'inspected' : ''}>
          {stage === 0 ? <span>{id}</span> : <button type="button"
            disabled={index < first || index > last} onClick={() => inspect(index)}
            aria-label={`Check locker ${id}`}>{id}</button>}
        </li>)}
      </ul>
      <p aria-live="polite">
        {stage === 0 && (scanned ? `Checked locker ${lastScanned}. Checks so far: ${scanned}.` : 'Ready to start.')}
        {stage === 1 && (lastGuess
          ? `Locker ${lastGuess} was too ${lastGuess < target ? 'low' : 'high'}. Checks so far: ${guesses.length}.`
          : `You found the locker in ${scanned} checks. Now try searching from the middle.`)}
      </p>
      {stage === 0 && <button className="primary" onClick={() => setScanned(previous => previous + 1)}>Check next locker</button>}
    </div> : <div className="two-col">
      <div className="panel">
        <h3>Your two searches</h3>
        <div className="stat-line"><span>Linear search</span><b>{scanned} checks</b></div>
        <div className="stat-line"><span>Search by narrowing the range</span><b>{guesses.length} checks</b></div>
        <p>Checking the middle every time is called binary search. It cuts the remaining search range roughly in half after each miss.</p>
      </div>
      <div className="panel">
        <fieldset className="search-question">
          <legend>Could you use binary search if the lockers were in random order?</legend>
          <label><input type="radio" name="locker-order" checked={answer === 'yes'} onChange={() => setAnswer('yes')}/> Yes</label>
          <label><input type="radio" name="locker-order" checked={answer === 'no'} onChange={() => setAnswer('no')}/> No</label>
        </fieldset>
        <p role="status">{answer === 'yes' && 'Try again. A higher number would tell you very little about which side to search if the lockers were shuffled.'}
          {answer === 'no' && 'Exactly. Sorting is what lets you rule out everything on one side of the number you checked.'}</p>
        <button className="primary" disabled={answer !== 'no'} onClick={() => {
          onComplete();
          setDone(true);
        }}>Complete Day 2 <Flag size={17} aria-hidden="true"/></button>
      </div>
    </div>}
  </section>;
}
