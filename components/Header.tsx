"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Outfit } from '@next/font/google';
import styles from './Header.module.css';

const outfit = Outfit({ subsets: ['latin'] });

const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className={styles.header} style={{
      backgroundColor: '#fff',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link 
          href="/" 
          className={`${styles.logo} ${isActive('/') ? styles.active : ''}`}
          prefetch={true}
        >
          Antidepressant Hyperbolic Calculator
        </Link>
        <div style={{
          display: 'flex',
          gap: '2rem'
        }}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
            prefetch={true}
            scroll={false}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
            prefetch={true}
            scroll={false}
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header; 