import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Drugs from './Drugs';

function DrugsImport() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('tab') !== 'reports') {
      const next = new URLSearchParams(searchParams);
      next.set('tab', 'reports');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return <Drugs />;
}

export default DrugsImport;
