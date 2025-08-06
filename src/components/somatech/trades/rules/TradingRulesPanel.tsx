import React, { useState } from 'react';

const TradingRulesPanel: React.FC = () => {
  const [rules, setRules] = useState('1. Only trade A+ setups.\n2. Max risk per trade: 1%.\n3. No revenge trading.');
  const [editing, setEditing] = useState(false);

  return (
    <div className="card p-4">
      <h2 className="text-lg font-bold mb-2">Trading Plan & Rules</h2>
      {editing ? (
        <>
          <textarea
            className="w-full h-32 border rounded mb-2"
            value={rules}
            onChange={e => setRules(e.target.value)}
          />
          <button className="btn btn-primary mr-2" onClick={() => setEditing(false)}>Save</button>
          <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <pre className="bg-gray-100 p-2 rounded mb-2 whitespace-pre-wrap">{rules}</pre>
          <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit Rules</button>
        </>
      )}
    </div>
  );
};

export default TradingRulesPanel; 