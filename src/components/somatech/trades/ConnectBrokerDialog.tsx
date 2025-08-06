import React from 'react';
import { useTrades } from './context/TradesProvider';

const ConnectBrokerDialog: React.FC = () => {
  const { isSyncing, connectBroker } = useTrades();

  return (
    <div className="modal">
      <h2 className="text-xl font-bold mb-4">Connect to Thinkorswim</h2>
      <p className="mb-4">Securely connect your Thinkorswim account to import your trades.</p>
      <button
        className="btn btn-primary"
        onClick={connectBroker}
        disabled={isSyncing}
      >
        {isSyncing ? 'Connecting...' : 'Connect Thinkorswim'}
      </button>
    </div>
  );
};

export default ConnectBrokerDialog; 