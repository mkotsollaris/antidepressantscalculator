import React from 'react';
import Header from './Header';
import { Outfit } from '@next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      fontFamily: outfit.style.fontFamily
    }}>
      <Header />
      {children}
      <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e9ecef',
          textAlign: 'center',
          color: '#666',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          fontFamily: outfit.style.fontFamily
        }}>
          © {new Date().getFullYear()} Antidepressants Calculator. All rights reserved.
        </div>
    </div>
  );
};

export default Layout; 