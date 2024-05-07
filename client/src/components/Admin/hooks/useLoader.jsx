import { useState } from 'react';

function useLoader() {
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const Loader = () => {
    return loading ? (
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 fade-loader'>
        <div role='status'>
          <div className='w-12 h-12 rounded-full animate-spin border-x-2 border-solid border-[#5fbdc7] border-t-transparent'></div>
        </div>
      </div>
    ) : null;
  };

  return { loading, startLoading, stopLoading, Loader };
}

export default useLoader;
