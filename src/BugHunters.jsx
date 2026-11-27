import React, { useState } from 'react';
import { ArrowLeft, Check, Flag, RotateCcw } from 'lucide-react';

const cases = [
  { id: 'extra', label: 'Extra tickets', available: 8, requested: 6, expected: true },
  { id: 'exact', label: 'Exactly enough tickets', available: 6, requested: 6, expected: true },
  { id: 'short', label: 'Too few tickets', available: 4, requested: 6, expected: false }
];
const rules = [
  { operator: '>', label: 'More tickets than requested', allows: (available, requested) => available > requested },
  { operator: '>=', label: 'At least as many tickets as requested', allows: (available, requested) => available >= requested },
  { operator: '===', label: 'Exactly as many tickets as requested', allows: (available, requested) => available === requested }
];

function runChecks(rule) {
  return cases.map(test => ({ ...test, actual: rule.allows(test.available, test.requested) }));
}

function bookingStatus(allowed) {
  return allowed ? 'Accepted' : 'Rejected';
}

export default function BugHunters({ onBoard, onComplete }) {
  const [stage, setStage] = useState('investigate');
  const [observations, setObservations] = useState({});
  const [operator, setOperator] = useState(rules[0].operator);
  const [results, setResults] = useState([]);
  const allCasesChecked = cases.every(test => test.id in observations);
  const allTestsPassed = results.length > 0 && results.every(test => test.expected === test.actual);

  function replay() {
    setStage('investigate');
    setObservations({});
    setOperator(rules[0].operator);
    setResults([]);
  }

  if (stage === 'done') {
    return <section className="shell done">
      <div className="completion-mark"><Check size={45} aria-hidden="true"/></div>
      <h1>Day 3 flag unlocked</h1>
      <p className="lead">You reproduced the bug, fixed the exact-match case, and checked that the other bookings still work.</p>
      <div className="done-actions">
        <button className="primary" onClick={onBoard}>Back to mission board</button>
        <button className="secondary" onClick={replay}><RotateCcw size={17} aria-hidden="true"/> Replay Day 3</button>
      </div>
    </section>;
  }

  return <section className="shell mission">
    <div className="mission-top">
      <button className="back" onClick={onBoard}><ArrowLeft size={16} aria-hidden="true"/> Mission board</button>
      <span className="mission-label">DAY 03 <span> / </span> BUG HUNTERS</span>
    </div>
    <div className="stepper" aria-label="Mission progress">
      <div className={'step ' + (stage === 'investigate' ? 'current' : 'past')} aria-current={stage === 'investigate' ? 'step' : undefined}>
        <span>1</span><small>Reproduce</small>
      </div>
      <div className={'step ' + (stage === 'repair' ? 'current' : '')} aria-current={stage === 'repair' ? 'step' : undefined}>
        <span>2</span><small>Fix and retest</small>
      </div>
    </div>
    <div className="stage-heading">
      <h2>{stage === 'investigate' ? 'What’s rejecting valid bookings?' : 'Fix the rule and run the tests again.'}</h2>
      <p>{stage === 'investigate'
        ? 'The campus fest’s ticket desk rejects some bookings. A booking should go through whenever there are enough tickets. Try three cases and compare the expected and actual results.'
        : 'Choose the comparison that accepts bookings when there are enough tickets. Run all three tests to see whether your fix works.'}</p>
    </div>
    {stage === 'investigate' ? <div className="panel">
      <div className="service-list">
        {cases.map(test => <div className="bug-case" key={test.id}>
          <div>
            <h3>{test.label}</h3>
            <p>{test.available} available · {test.requested} requested · Expected: {bookingStatus(test.expected)}</p>
            <p role="status">{test.id in observations && <>Actual: <strong>{bookingStatus(observations[test.id])}</strong> · {observations[test.id] === test.expected ? 'Matches' : 'Bug reproduced'}</>}</p>
          </div>
          <button className="secondary" onClick={() => setObservations(previous => ({
            ...previous, [test.id]: rules[0].allows(test.available, test.requested)
          }))}>Try booking</button>
        </div>)}
      </div>
      <button className="primary full" disabled={!allCasesChecked} onClick={() => setStage('repair')}>Inspect the booking rule</button>
    </div> : <div className="two-col">
      <div className="panel">
        <p className="booking-rule"><code>available {operator} requested</code></p>
        <fieldset className="search-question booking-options">
          <legend>When should the booking be accepted?</legend>
          {rules.map(({ operator: candidate, label }) => <label key={candidate}>
            <input type="radio" name="booking-rule" checked={operator === candidate} onChange={() => {
              setOperator(candidate);
              setResults([]);
            }}/>
            {label}
          </label>)}
        </fieldset>
        <button className="secondary full" onClick={() => {
          setResults(runChecks(rules.find(rule => rule.operator === operator)));
        }}>Run all tests</button>
      </div>
      <div className="panel" aria-live="polite">
        <h3>Test results</h3>
        {results.length === 0 && <p>Run the tests to check your rule.</p>}
        {results.map(test => <div className="stat-line" key={test.id}>
          <span>{test.label}</span>
          <b>{test.expected === test.actual ? 'Pass' : `Fail · ${bookingStatus(test.actual)}`}</b>
        </div>)}
        {allTestsPassed && <p>The rule includes the exact match, accepts bookings with extra tickets, and rejects bookings that ask for too many.</p>}
        <button className="primary full" disabled={!allTestsPassed} onClick={() => {
          onComplete();
          setStage('done');
        }}>Complete Day 3 <Flag size={17} aria-hidden="true"/></button>
      </div>
    </div>}
  </section>;
}
