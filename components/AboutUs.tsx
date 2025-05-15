import React from 'react';
import { Outfit } from '@next/font/google';
import Image from 'next/image';

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
        
        <div style={{
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          color: '#666',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          We are a team of experts combining technical innovation with clinical psychology research to create tools that help people better understand their mental health journey.
        </div>
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
          alignItems: 'center',
          textAlign: 'center',
          height: '100%',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              marginBottom: '1rem',
              border: '4px solid #f8f9fa',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Image
                src="/vp.jpg"
                alt="Vasilis Pallikaras"
                width={150}
                height={150}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              color: '#2c3e50',
              marginBottom: '0.75rem',
              fontWeight: '500'
            }}>
              Dr. Vasilis Pallikaras
            </h2>
            <p style={{
              lineHeight: '1.6',
              color: '#444',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
            }}>
              A clinical psychologist at the Ottawa Hospital, specializing in evidence-based therapies including cognitive behavioral therapy (CBT), acceptance and commitment therapy (ACT), and mentalization-based therapy. With extensive research experience in motivation and depression, Dr. Pallikaras ensures our tools are grounded in scientific evidence and clinical best practices.
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          height: '100%',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              marginBottom: '1rem',
              border: '4px solid #f8f9fa',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Image
                src="/mk.jpeg"
                alt="Menelaos Kotsollaris"
                width={150}
                height={150}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              color: '#2c3e50',
              marginBottom: '0.75rem',
              fontWeight: '500'
            }}>
              Menelaos Kotsollaris
            </h2>
            <p style={{
              lineHeight: '1.6',
              color: '#444',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
            }}>
              A seasoned software engineer with extensive experience in full-stack development, cloud architecture, and technical leadership. With a strong background in building scalable applications and leading engineering teams, Menelaos brings technical expertise to create robust and user-friendly mental health tools.
            </p>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          color: '#2c3e50',
          marginBottom: '1rem',
          fontWeight: '500'
        }}>
          Our Mission
        </h2>
        <p style={{
          lineHeight: '1.6',
          color: '#444',
          fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
        }}>
          We combine technical innovation with clinical expertise to create tools that help people better understand and manage their mental health journey. Our goal is to make evidence-based mental health information and tools accessible to everyone.
        </p>
      </div>
    </div>
  );
};

export default AboutUs; 