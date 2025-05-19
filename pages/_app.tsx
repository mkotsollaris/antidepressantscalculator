import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsTransitioning(true);
      document.body.classList.add('page-transition-enter');
    };

    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        document.body.classList.remove('page-transition-enter');
        setIsTransitioning(false);
      }, 300);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <div className={isTransitioning ? 'page-transition-enter' : ''}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp; 