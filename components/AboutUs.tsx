import React from 'react';
import { Outfit } from '@next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

const AboutUs = () => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: outfit.style.fontFamily
    }}>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          color: '#2c3e50',
          marginBottom: '1.5rem',
          fontWeight: '600',
          letterSpacing: '-0.5px'
        }}>
          About Us
        </h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem',
        alignItems: 'stretch'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          flexDirection: 'column',
          textAlign: 'left',
          height: '100%',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              color: '#2c3e50',
              marginBottom: '0.75rem',
              fontWeight: '500'
            }}>
              Dr. Vasilis Pallikaras, PhD.
            </h2>
            <p style={{
              lineHeight: '1.6',
              color: '#444',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
            }}>
              A clinical psychologist and neuroscientist with research interest and experience spanning depression, psychopharmacology, the brain reward system, movement disorders, and rehabilitation/health psychology.
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          flexDirection: 'column',
          textAlign: 'left',
          height: '100%',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              color: '#2c3e50',
              marginBottom: '0.75rem',
              fontWeight: '500'
            }}>
              Menelaos Kotsollaris, MSc.
            </h2>
            <p style={{
              lineHeight: '1.6',
              color: '#444',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
            }}>
              A computer scientist with extensive experience in full-stack development and cloud architecture. With academic research experience and strong software engineering skills, he brings technical expertise to create robust and scalable solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 