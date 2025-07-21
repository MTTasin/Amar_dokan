import React from 'react';
import { Loader } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="flex flex-col items-center">
        <Loader className="animate-spin text-brand-orange h-12 w-12" />
        <p className="mt-4 text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
