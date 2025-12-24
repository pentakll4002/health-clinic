import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Drugs from './Drugs';

function DrugsInventory() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Inventory view defaults to drugs list tab
    if (searchParams.get('tab')) {
      const next = new URLSearchParams(searchParams);
      next.delete('tab');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return <Drugs />;
}

export default DrugsInventory;
