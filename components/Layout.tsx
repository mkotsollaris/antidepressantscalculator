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
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        marginTop: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderTop: '1px solid #e9ecef'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          color: '#2c3e50',
          marginBottom: '1rem',
          fontWeight: '500',
          fontFamily: outfit.style.fontFamily
        }}>
          Important Disclaimer
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          <div>
            <h3 style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
              color: '#2c3e50',
              marginBottom: '0.75rem',
              fontWeight: '500',
              fontFamily: outfit.style.fontFamily
            }}>
              Medical Advice
            </h3>
            <p style={{
              lineHeight: '1.6',
              color: '#444',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              fontFamily: outfit.style.fontFamily
            }}>
              This calculator is for informational purposes only and should not be used as a substitute for professional medical advice. Always consult with your healthcare provider before making any changes to your medication regimen.
            </p>
          </div>
          <div>
            <h3 style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
              color: '#2c3e50',
              marginBottom: '0.75rem',
              fontWeight: '500',
              fontFamily: outfit.style.fontFamily
            }}>
              Development Status
            </h3>
            <p style={{
              lineHeight: '1.6',
              color: '#444',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              fontFamily: outfit.style.fontFamily
            }}>
              This tool is under active development. The calculations and data presented are based on current research but may be updated as new information becomes available.
            </p>
          </div>
        </div>
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
    </div>
  );
};

export default Layout; 