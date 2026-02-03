import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@components/ui/BaseComponents';

export const AutomationPageSimple: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">Automations Test</h1>
      
      <div className="p-4 bg-blue-900/50 text-blue-200">
        Modal is: {showModal ? 'OPEN' : 'CLOSED'}
      </div>

      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
      >
        Plain HTML Button
      </button>

      <Button
        type="button"
        onClick={() => {
          console.log('Button clicked!');
          setShowModal(true);
        }}
        className="inline-flex items-center gap-2"
      >
        <Plus size={18} />
        Component Button
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Modal Opened!</h2>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
