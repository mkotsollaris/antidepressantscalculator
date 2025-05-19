import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useRouterPath() {
  const router = useRouter();
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    if (router.isReady) {
      setPathname(router.pathname);
    }
  }, [router.isReady, router.pathname]);

  return pathname;
} 