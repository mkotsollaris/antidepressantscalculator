// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Line } from 'react-chartjs-2';
import { registerables } from 'chart.js';
import { Outfit } from '@next/font/google';
import Layout from './Layout';
import Header from './Header';

const outfit = Outfit({ subsets: ['latin'] });

ChartJS.register(...registerables, ArcElement, Tooltip, Legend);

const antiDepressantData = {
  'Citalopram (Celexa)': {
    targets: [
      {
        Striatum: {
          maxDose: 60,
          vMax: 83.98,
          k: 2.33
        }
      }
    ]
  },
  'Desvenlafaxine (Pristiq)': {
    targets: [
      {
        Amygdala: {
          maxDose: 140,
          vMax: 106.43,
          k: 11.57
        }},
        {
        Midbrain: {
          maxDose: 140,
          vMax: 99.46,
          k: 10.92
        }
      },
        {Striatum: {
          maxDose: 140,
          vMax: 100.22,
          k: 16.11
        }},
        {Thalamus: {
          maxDose: 140,
          vMax: 100.11,
          k: 21.17
        }},
    ]
  },
  'Duloxetine (Cymbalta)': {
    targets: [{
      Thalamus: {
        maxDose: 60,
        vMax: 90.75,
        k: 6.27
      }
    }]
  },
  'Escitalopram (Lexapro, Cipralex)': {
    targets: [
      {
        Caudate: {
          maxDose: 30,
          vMax: 75.35,
          k: 0.66
        }
      },
      {
        Dorsal_Raphe_Nucleus: {
          maxDose: 30,
          vMax: 89.57,
          k: 2.72
        }
      },
      {
        Putamen: {
          maxDose: 30,
          vMax: 69.32,
          k: 1.22
        }
      },
      {
        Thalamus: {
          maxDose: 30,
          vMax: 78.67,
          k: 2.10
        }
      }
    ]
  },
  'Fluoxetine (Prozac)': {
    targets: [
      {
        Striatum: {
          maxDose: 60,
          vMax: 86.12,
          k: 1.89
        }
      }
    ]
  },
  'Paroxetine (Paxil)': {
    targets: [{
      Striatum: {
          maxDose: 60,
          vMax: 97.14,
          k: 5.60
      }
    }]
  },
  'Sertraline (Zoloft)': {
    targets: [
      {
        Striatum: {
          maxDose: 200,
          vMax: 92.01,
          k: 7.72
        }
      }
    ]
  },
  'Venlafaxine XR (Effexor XR)': {
    targets: [
      {
        Striatum: {
          maxDose: 200,
          vMax: 90.07,
          k: 5.80
        }
      }
    ]
  },
  'Vortioxetine (Trintellix)': {
    targets: [
      {
        Raphe_Nuclei: {
          maxDose: 60,
          vMax: 102.24,
          k: 4.68
        }
      }
    ]
  }
}

function getMaxDose(key: string, targetValue: string) {
  // @ts-ignore
  if (!antiDepressantData[key]) {
    return 'Key not found in antiDepressantData';
  }

  // @ts-ignore
  const targets = antiDepressantData[key].targets;

  for (let i = 0; i < targets.length; i++) {
    if (targets[i][targetValue]) {
      return targets[i][targetValue].maxDose;
    }
  }

  return 'Target value not found for key';
}

function getK(key: string, targetValue: string) {
  // @ts-ignore
  if (!antiDepressantData[key]) {
    return 'Key not found in antiDepressantData';
  }

  // @ts-ignore
  const targets = antiDepressantData[key].targets;

  for (let i = 0; i < targets.length; i++) {
    if (targets[i][targetValue]) {
      return targets[i][targetValue].k;
    }
  }

  return 'Target value not found for key';
}

function getVmax(key: string, targetValue: string) {
  // @ts-ignore
  if (!antiDepressantData[key]) {
    return 'Key not found in antiDepressantData';
  }

  // @ts-ignore
  const targets = antiDepressantData[key].targets;

  for (let i = 0; i < targets.length; i++) {
    if (targets[i][targetValue]) {
      return targets[i][targetValue].vMax;
    }
  }

  return 'Target value not found for key';
}

function getFirstTarget(key: string) {
  // @ts-ignore
  if (!antiDepressantData[key]) {
    return 'Key not found in antiDepressantData';
  }

  const targets = antiDepressantData[key].targets;
  const firstTarget = Object.keys(targets[0])[0];

  return firstTarget;
}

function getTargets(key: string) {
  if (!antiDepressantData[key]) {
    return 'Key not found in antiDepressantData';
  }

  const targets = antiDepressantData[key].targets;
  const targetsArray = targets.map(target => Object.keys(target)[0]);

  return targetsArray;
}

const SimpleChart = () => {
    const [km, setKm] = useState(2.33);
    const [vMax, setVmax] = useState(83.98);
    const substrateConcentration = [];
    const reactionRate = [];
    const [selectedAntiDepressant, setSelectedAntiDepressant] = useState("Citalopram (Celexa)")
    const [selectedTarget, setSelectedTarget] = useState("Striatum")
    const [targets, setTargets] = useState(getTargets("Citalopram (Celexa)"))
    const [currApproach, setCurrApproach] = useState('Linear')
    const antiDepressantOptions = Object.keys(antiDepressantData).map(e => e)
    const maxDose = getMaxDose(selectedAntiDepressant, selectedTarget);
    const [percentagePoint, setPercentagePoint] = useState(10);
    const [startingPoint, setStartingPoint] = useState(undefined);
    const [reductionRate, setReductionRate] = useState(10);
    const [reductionPreference, setReductionPreference] = useState('relative');
    const [showCustomReduction, setShowCustomReduction] = useState(false);
    const [customReductionRate, setCustomReductionRate] = useState('');
    
    // Get the effective max dose based on whether startingPoint is set
    const effectiveMaxDose = startingPoint ? startingPoint : maxDose;
    
    useEffect(() => {
      setOccupancyDifference(computeOccupancyDifference(reactionRate, percentagePoint));
    }, [selectedAntiDepressant, selectedTarget, currApproach, percentagePoint, startingPoint, reductionPreference, reductionRate]);
  
    // Calculate relative reduction values
    const getRelativeReductionValues = () => {
      if (!startingPoint) return [];
      const values = [];
      const startDose = Number(startingPoint.toFixed(2));
      const startOccupancy = Number(((vMax * startDose) / (km + startDose)).toFixed(2)); // Calculate initial occupancy
      const reductionAmount = Number((startOccupancy * (reductionRate / 100)).toFixed(2)); // Calculate reduction amount based on starting occupancy
      
      let currentDose = startDose;
      let currentOccupancy = startOccupancy;
      
      while (currentDose > 0.01) { // Stop when dose is very small
        values.push({
          dose: Number(currentDose.toFixed(2)),
          occupancy: Number(currentOccupancy.toFixed(2))
        });
        currentOccupancy = Number((currentOccupancy - reductionAmount).toFixed(2)); // Subtract the same amount each time
        // Calculate the corresponding dose for the new occupancy
        currentDose = Number(((km * currentOccupancy) / (vMax - currentOccupancy)).toFixed(2));
      }
      return values;
    };

    // Calculate absolute reduction values
    const getAbsoluteReductionValues = () => {
      if (!startingPoint) return [];
      const values = [];
      const startDose = Number(startingPoint.toFixed(2));
      const startOccupancy = Number(((vMax * startDose) / (km + startDose)).toFixed(2)); // Calculate initial occupancy
      
      // Start with the initial dose
      values.push({
        dose: startDose,
        occupancy: startOccupancy
      });

      // Calculate target occupancy percentages
      const targetPercentages = [];
      let currentPercentage = Math.floor(startOccupancy / reductionRate) * reductionRate; // Round down to nearest reductionRate
      while (currentPercentage >= reductionRate) {
        targetPercentages.push(currentPercentage);
        currentPercentage -= reductionRate;
      }

      // For each target percentage, calculate the exact dose needed
      targetPercentages.forEach(targetPercentage => {
        // Calculate the exact dose needed for the target occupancy using the inverse of Michaelis-Menten
        const targetDose = Number(((km * targetPercentage) / (vMax - targetPercentage)).toFixed(2));
        
        values.push({
          dose: targetDose,
          occupancy: targetPercentage
        });
      });
      
      return values;
    };

    const relativeValues = getRelativeReductionValues();
    const absoluteValues = getAbsoluteReductionValues();
    
    const occupancyIncrements = (reductionPreference === 'relative' ? relativeValues : absoluteValues).map((value, index) => ({
      x: Number(value.dose.toFixed(2)),
      y: Number(value.occupancy.toFixed(2)),
    }));

    // Keep the full graph range
    for (var i = 0; i <= maxDose; i+=1) {
      substrateConcentration.push(`${i}`);
      reactionRate.push((vMax * i) / (km + i));
    }
    const [occupancyDifference, setOccupancyDifference] = useState(computeOccupancyDifference(reactionRate, 10));


    const handleDropdownChange = (e: any) => {
      const firstTarget = getFirstTarget(e.target.value);
      const newKM = getK(e.target.value, firstTarget)
      const newVmax = getVmax(e.target.value, firstTarget)
      setSelectedAntiDepressant(e.target.value);
      setTargets(getTargets(e.target.value));
      setSelectedTarget(firstTarget);
      setKm(newKM)
      setVmax(newVmax)
    }

    const handlePercentagePoint = (e: any) => {
      const newPercentage = parseInt(e.target.value);
      setPercentagePoint(newPercentage);
    }
    const handleStartingPoint = (e: any) => {
      const newStartingPoint = parseInt(e.target.value);
      setStartingPoint(newStartingPoint);
      // Clear the arrays to force recalculation
      substrateConcentration.length = 0;
      reactionRate.length = 0;
    }

    const handleReductionRate = (e: any) => {
      const newReductionRate = e.target.value;
      if (newReductionRate === 'other') {
        setShowCustomReduction(true);
      } else {
        setShowCustomReduction(false);
        setReductionRate(parseInt(newReductionRate));
      }
    }

    const handleCustomReductionRate = (e: any) => {
      const value = e.target.value;
      setCustomReductionRate(value);
      if (value && !isNaN(value)) {
        setReductionRate(parseInt(value));
      }
    }

    const handleReductionPreference = (e: any) => {
      setReductionPreference(e.target.value);
    }

    const handleTargetChange = (e: any) => {
      const newTarget = e.target.value;
      const newKM = getK(selectedAntiDepressant, newTarget)
      const newVmax = getVmax(selectedAntiDepressant, newTarget)

      setSelectedTarget(e.target.value)
      setKm(newKM)
      setVmax(newVmax)
    }

    const handleApproachChange = (e: any) => {
      const newApproach = e.target.value;
      setCurrApproach(newApproach)
    }

    const handleReductionChange = (e: any) => {
      const newReduction = e.target.value as number;
      const newOccupancyDifference = computeOccupancyDifference(reactionRate, newReduction);
      setOccupancyDifference(newOccupancyDifference);
    }

    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          mode: 'point',
          intersect: true,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#2c3e50',
          bodyColor: '#2c3e50',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          titleFont: {
            size: 16,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          },
          bodyFont: {
            size: 15,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          },
          filter: function(tooltipItem) {
            // Only show tooltips for the second dataset (magenta points)
            return tooltipItem.datasetIndex === 1;
          },
          callbacks: {
            label: function(context) {
              return `Dose: ${context.parsed.x.toFixed(2)}mg, Occupancy: ${context.parsed.y.toFixed(2)}%`;
            }
          }
        },
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            filter: function(legendItem, data) {
              return legendItem.text === 'Dose Schedule';
            },
            font: {
              size: 16,
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          display: true,
          position: 'bottom',
          title: {
            display: true,
            text: `${selectedAntiDepressant} Dose (mg)`,
            font: {
              size: 18,
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              weight: '700'
            },
            padding: {top: 10}
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: true,
            borderColor: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: 14,
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
            },
            padding: 8
          }
        },
        y: {
          title: {
            display: true,
            text: 'SERT Occupancy (%)',
            font: {
              size: 18,
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              weight: '700'
            },
            padding: {bottom: 10}
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: true,
            borderColor: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: 14,
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
            },
            padding: 8
          },
          min: 0,
          max: 100
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0,
          hitRadius: 8,
          hoverRadius: 6
        }
      }
    };

    const reductionApproachesOptions = {
      Linear: [2, 5, 10 ,20],
      // Microtapering: [],
      // Minitapering: [5, 10, 15, 20]
    };

    function getReductionApproachOptions(key: string) {
      return reductionApproachesOptions[key];
    }

    function getApproachOptions() {
      return Object.keys(reductionApproachesOptions);
    }

    function computeOccupancyDifference(reactionRate, stepReduction) {
      const occupancyDifference = [];
      occupancyDifference.push(reactionRate[0]);
      for (let i = parseInt(stepReduction); i < reactionRate.length+stepReduction; i+=1) {
        if(i>=reactionRate.length) occupancyDifference.push(reactionRate[reactionRate.length-1] - reactionRate[reactionRate.length-1 - stepReduction])
        else occupancyDifference.push(reactionRate[i] - reactionRate[i - stepReduction]);
      }
      return occupancyDifference
    }

    const TooltipComponent = ({ text }) => {
      const [isVisible, setIsVisible] = useState(false);

      return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <span 
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            style={{ 
              marginLeft: '0.5rem',
              color: '#666',
              cursor: 'help',
              display: 'inline-block',
              fontSize: '1rem',
              fontWeight: '500',
              width: '22px',
              height: '22px',
              lineHeight: '22px',
              textAlign: 'center',
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              transition: 'all 0.2s ease',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
          >
            ?
          </span>
          {isVisible && (
            <div 
              onMouseEnter={() => setIsVisible(true)}
              onMouseLeave={() => setIsVisible(false)}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#2c3e50',
                color: 'white',
                padding: '1rem 1.2rem',
                borderRadius: '6px',
                fontSize: '1rem',
                width: 'max-content',
                maxWidth: '300px',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                marginBottom: '0.8rem',
                fontFamily: outfit.style.fontFamily,
                lineHeight: '1.5',
                fontWeight: '400',
                letterSpacing: '0.3px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                pointerEvents: 'auto'
              }}
            >
              {text}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                border: '6px solid transparent',
                borderTopColor: '#2c3e50'
              }} />
            </div>
          )}
        </div>
      );
    };

    const data = {
      labels: substrateConcentration,
      datasets: [
        {
          label: '',  // Empty label for the curve
          data: reactionRate,
          backgroundColor: 'rgba(0, 114, 178, 0.1)',  // Blue
          borderColor: 'rgba(0, 114, 178, 1)',        // Blue
          borderWidth: 2,
          fill: true,
          pointBackgroundColor: 'rgba(0, 114, 178, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          pointHoverBackgroundColor: 'rgba(0, 114, 178, 1)',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        },
        {
          label: 'Dose Schedule',
          data: occupancyIncrements,
          backgroundColor: 'rgba(186, 104, 200, 1)',     // Magenta
          borderColor: 'rgba(186, 104, 200, 1)',         // Magenta
          borderWidth: 0,
          fill: false,
          pointRadius: 6,
          pointHoverRadius: 12,
          pointBackgroundColor: 'rgba(186, 104, 200, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: 'rgba(186, 104, 200, 1)',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          showLine: false
        }
      ]
    };
    

    return (
      <Layout>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#2c3e50',
            marginBottom: '1rem',
            fontWeight: '600',
            letterSpacing: '-0.5px',
            fontFamily: outfit.style.fontFamily
          }}>
            Antidepressant Hyperbolic Calculator
          </h1>
          
          <div style={{
            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
            color: '#666',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Calculate and visualize the relationship between drug dose and receptor occupancy.
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ 
              color: '#2c3e50', 
              marginBottom: '1rem',
              fontFamily: outfit.style.fontFamily,
              fontSize: '1.5rem'
            }}>Antidepressant Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#666',
                  fontFamily: outfit.style.fontFamily,
                  fontSize: '1.1rem'
                }}>
                  Antidepressant
                  <TooltipComponent text="Select the antidepressant medication you are currently taking. Each medication has specific receptor binding properties that affect the reduction schedule." />
                </label>
                <select 
                  onChange={handleDropdownChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontFamily: outfit.style.fontFamily,
                    fontSize: '1.1rem'
                  }}>
                  {antiDepressantOptions.map(option => 
                    <option key={option} value={option}>{option}</option>
                  )}
                </select>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#666',
                  fontFamily: outfit.style.fontFamily,
                  fontSize: '1.1rem'
                }}>
                  Brain Area
                  <TooltipComponent text="Select the brain region where the medication's effects are being measured. Different brain areas may have varying receptor densities and binding characteristics." />
                </label>
                <select 
                  onChange={handleTargetChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontFamily: outfit.style.fontFamily,
                    fontSize: '1.1rem'
                  }}>
                  {targets.map(option => 
                    <option key={option} value={option}>{option}</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ 
              color: '#2c3e50', 
              marginBottom: '1rem',
              fontFamily: outfit.style.fontFamily,
              fontSize: '1.5rem'
            }}>Reduction Settings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#666',
                  fontFamily: outfit.style.fontFamily,
                  fontSize: '1.1rem'
                }}>
                  Starting Dose
                  <TooltipComponent text="Enter your current medication dose in milligrams (mg). This will be used as the starting point for calculating the reduction schedule." />
                </label>
                <input 
                  type="number" 
                  min="0" 
                  max={maxDose} 
                  onChange={handleStartingPoint}
                  placeholder={`Enter your starting dose`}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontFamily: outfit.style.fontFamily,
                    fontSize: '1.1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#666',
                  fontFamily: outfit.style.fontFamily,
                  fontSize: '1.1rem'
                }}>
                  Occupancy Reduction (%)
                  <TooltipComponent text="Choose how much to reduce the receptor occupancy at each step. A smaller percentage means a more gradual reduction." />
                </label>
                <select 
                  onChange={handleReductionRate}
                  value={showCustomReduction ? 'other' : reductionRate.toString()}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontFamily: outfit.style.fontFamily,
                    fontSize: '1.1rem',
                    marginBottom: showCustomReduction ? '0.5rem' : '0'
                  }}>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                  <option value="other">Other</option>
                </select>
                {showCustomReduction && (
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={customReductionRate}
                    onChange={handleCustomReductionRate}
                    placeholder="Enter custom reduction rate"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontFamily: outfit.style.fontFamily,
                      fontSize: '1.1rem'
                    }}
                  />
                )}
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#666',
                  fontFamily: outfit.style.fontFamily,
                  fontSize: '1.1rem'
                }}>
                  Reduction Preference
                  <TooltipComponent text="Relative: Reduces by a percentage of the current occupancy. Absolute: Reduces to specific occupancy percentages." />
                </label>
                <select 
                  value={reductionPreference}
                  onChange={handleReductionPreference}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontFamily: outfit.style.fontFamily,
                    fontSize: '1.1rem'
                  }}>
                  <option value="relative">Relative</option>
                  <option value="absolute">Absolute</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ 
              color: '#2c3e50', 
              marginBottom: '1.5rem',
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              borderBottom: '2px solid #f0f0f0',
              paddingBottom: '0.5rem',
              fontFamily: outfit.style.fontFamily
            }}>
              Receptor Occupancy Graph
              <TooltipComponent text="The curve shows the relationship between drug dose and receptor occupancy. Points on the curve represent reduction steps." />
            </h4>
            <div style={{ height: 'clamp(300px, 50vw, 500px)' }}>
              <Line data={data} options={options} />
            </div>
          </div>

          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                borderBottom: '2px solid #f0f0f0',
                paddingBottom: '0.5rem'
              }}>
                <h3 style={{ 
                  color: '#2c3e50',
                  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                  margin: 0,
                  fontFamily: outfit.style.fontFamily
                }}>
                  {reductionPreference === 'relative' ? 'Relative' : 'Absolute'} Reduction ({reductionRate}%)
                </h3>
                <TooltipComponent text={reductionPreference === 'relative' 
                  ? "Relative reduction: Each step reduces the current occupancy by a fixed percentage." 
                  : "Absolute reduction: Each step reduces to a specific occupancy percentage."} />
              </div>
              {!startingPoint ? (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '2rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '2px dashed #e0e0e0',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: '1.2rem',
                    color: '#666',
                    marginBottom: '0.5rem',
                    fontFamily: outfit.style.fontFamily
                  }}>
                    Enter a Starting Dose to View Reduction Schedule
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#888',
                    fontFamily: outfit.style.fontFamily
                  }}>
                    The reduction schedule will be calculated based on your current medication dose
                  </div>
                </div>
              ) : (
                <ol style={{ 
                  listStyleType: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li style={{
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    marginBottom: '0.5rem',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: outfit.style.fontFamily,
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.3s ease'
                  }}>
                    <span>Starting Dose</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {effectiveMaxDose} mg ({((vMax * effectiveMaxDose) / (km + effectiveMaxDose)).toFixed(2)}%)
                    </span>
                  </li>
                  {(reductionPreference === 'relative' ? relativeValues : absoluteValues).slice(1).map((value, index) => (
                    <li key={`reduction-${index}`} style={{
                      padding: '0.75rem',
                      backgroundColor: '#f8f9fa',
                      marginBottom: '0.5rem',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: outfit.style.fontFamily,
                      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.3s ease'
                    }}>
                      <span>Step {index + 1}</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {value.dose.toFixed(2)} mg ({value.occupancy.toFixed(2)}%)
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '12px',
          marginTop: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: '#2c3e50',
            marginBottom: '1.5rem',
            fontWeight: '500',
            fontFamily: outfit.style.fontFamily
          }}>
            About the Calculator
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h3 style={{
                fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)',
                color: '#2c3e50',
                marginBottom: '1rem',
                fontWeight: '500',
                fontFamily: outfit.style.fontFamily
              }}>
                The Model
              </h3>
              <p style={{
                lineHeight: '1.6',
                color: '#444',
                marginBottom: '1rem',
                fontFamily: outfit.style.fontFamily,
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
              }}>
                This calculator uses the Michaelis-Menten equation to model the relationship between drug dose and receptor occupancy:
              </p>
              <div style={{
                backgroundColor: '#fff',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontFamily: 'monospace',
                fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                color: '#2c3e50',
                overflowX: 'auto'
              }}>
                V = (Vmax * [S]) / (Km + [S])
              </div>
              <p style={{
                lineHeight: '1.6',
                color: '#444',
                fontFamily: outfit.style.fontFamily,
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
              }}>
                Where:
                <ul style={{
                  listStyleType: 'none',
                  paddingLeft: '1rem',
                  marginTop: '0.5rem',
                  fontFamily: outfit.style.fontFamily,
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
                }}>
                  <li>• Vmax: Maximum receptor occupancy (horizontal asymptote)</li>
                  <li>• Km: Dose at which occupancy is half of Vmax</li>
                  <li>• [S]: Drug dose</li>
                </ul>
              </p>
            </div>

            <div>
              <h3 style={{
                fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)',
                color: '#2c3e50',
                marginBottom: '1rem',
                fontWeight: '500',
                fontFamily: outfit.style.fontFamily
              }}>
                How to Use
              </h3>
              <ol style={{
                paddingLeft: '1.5rem',
                color: '#444',
                lineHeight: '1.6',
                fontFamily: outfit.style.fontFamily,
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
              }}>
                <li style={{ marginBottom: '0.5rem' }}>Select your antidepressant and target brain region</li>
                <li style={{ marginBottom: '0.5rem' }}>Enter your starting dose</li>
                <li style={{ marginBottom: '0.5rem' }}>Choose your desired reduction rate</li>
                <li style={{ marginBottom: '0.5rem' }}>Select between relative or absolute reduction</li>
                <li style={{ marginBottom: '0.5rem' }}>View the graph and reduction schedule</li>
              </ol>
            </div>
          </div>

          <div style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            color: '#666',
            borderTop: '1px solid #e9ecef',
            paddingTop: '1rem',
            marginTop: '1rem',
            fontFamily: outfit.style.fontFamily
          }}>
            Based on research from: 
            <a 
              href="https://www.nature.com/articles/s41380-021-01285-w#Sec7" 
              style={{ 
                color: '#3498db', 
                textDecoration: 'none',
                marginLeft: '0.5rem',
                fontWeight: '500'
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              The relationship between dose and serotonin transporter occupancy of antidepressants—a systematic review
            </a>
          </div>
        </div>
      </Layout>
    );
}

export default SimpleChart