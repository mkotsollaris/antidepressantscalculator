// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Line } from 'react-chartjs-2';
import { registerables } from 'chart.js';

ChartJS.register(...registerables, ArcElement, Tooltip, Legend);

const antiDepressantData = {
  Citalopram: {
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
  Desvenlafaxine: {
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
  Duloxetine: {
    targets: [{
      Thalamus: {
        maxDose: 60,
        vMax: 90.75,
        k: 6.27
      }
    }]
  },
  Escitalopram: {
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
  Fluoxetine: {
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
  Paroxetine: {
    targets: [{
      Striatum: {
          maxDose: 60,
          vMax: 97.14,
          k: 5.60
      }
    }]
  },
  Sertaline: {
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
  Venlafaxine_XR: {
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
  Vortioxetine: {
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

function getDoseForOccupancyIncrements(key, targetValue, increment) {
  const km = getK(key, targetValue);
  const vMax = getVmax(key, targetValue);
  const doses = [];
  const maxPercentage = 100;

  for (let occupancy = increment; occupancy <= maxPercentage; occupancy += increment) {
    const dose = ((km * occupancy) / (vMax - occupancy)).toFixed(2);
    if (dose >= 0 && dose < vMax) {
      doses.push(parseFloat(dose));
    } else {
      break;
    }
  }
  // need this to include vMax
  // doses.push(vMax)
  return doses;
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

const options = {
  pointRadius: 0,
  responsive: true,
  plugins: {
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'linear', // Add this line to change the x-axis type to 'linear'
      display: true,
      position: 'bottom',
      title: {
        display: true,
        text: 'Drug Dose (mg)',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Receptor Occupancy (%)',
      },
    },
  },
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

const SimpleChart = () => {

    const [km, setKm] = useState(2.33);
    const [vMax, setVmax] = useState(83.98);
    const substrateConcentration = [];
    const reactionRate = [];
    const [selectedAntiDepressant, setSelectedAntiDepressant] = useState("Citalopram")
    const [selectedTarget, setSelectedTarget] = useState("Striatum")
    const [targets, setTargets] = useState(getTargets("Citalopram"))
    const [currApproach, setCurrApproach] = useState('Linear')
    const antiDepressantOptions = Object.keys(antiDepressantData).map(e => e)
    const maxDose = getMaxDose(selectedAntiDepressant, selectedTarget);
    const [percentagePoint, setPercentagePoint] = useState(10);
    const [startingPoint, setStartingPoint] = useState(undefined);
    const [reductionRate, setReductionRate] = useState(10);
    const [reductionPreference, setReductionPreference] = useState('relative');
    
    // Get the effective max dose based on whether startingPoint is set
    const effectiveMaxDose = startingPoint ? startingPoint : maxDose;
    
    useEffect(() => {
      setOccupancyDifference(computeOccupancyDifference(reactionRate, percentagePoint));
    }, [selectedAntiDepressant, selectedTarget, currApproach, percentagePoint, startingPoint]);
  
    // Calculate relative reduction values
    const getRelativeReductionValues = () => {
      if (!startingPoint) return [];
      const values = [];
      const startDose = Number(startingPoint.toFixed(2));
      const startOccupancy = Number(((vMax * startDose) / (km + startDose)).toFixed(2)); // Calculate initial occupancy
      const reductionAmount = Number((startOccupancy * (reductionRate / 100)).toFixed(2)); // Calculate reduction amount based on starting occupancy
      
      let currentDose = startDose;
      let currentOccupancy = startOccupancy;
      
      while (currentDose > 0.1) { // Stop when dose is very small
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
    
    const occupancyIncrements = absoluteValues.map((value, index) => ({
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
      const newReductionRate = parseInt(e.target.value);
      setReductionRate(newReductionRate)
    }

    const handleReductionPreference = (e: any) => {
      const newReductionPreference = parseInt(e.target.value);
      setReductionPreference(newReductionPreference)
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

    
    const data = {
      labels: substrateConcentration,
      datasets: [
        {
          label: 'Occupancy (%)',
          data: reactionRate,
          backgroundColor: 'rgba(0, 0, 0, 1)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 3,
          fill: false,
        },
          // {
          //   label: 'Occupancy Difference',
          //   data: occupancyDifference,
          //   backgroundColor: 'rgba(54, 162, 235, 0.2)',
          //   borderColor: 'rgba(54, 162, 235, 1)',
          //   borderWidth: 3,
          //   fill: 'none',
          // },
          {
            label: 'Increment Point',
            data: occupancyIncrements,
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 3,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 6,
            showLine: false
          },
      ],
    };
    

    return <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          color: '#2c3e50',
          marginBottom: '1rem',
          fontWeight: '600',
          letterSpacing: '-0.5px'
        }}>
          Antidepressant Hyperbolic Calculator
        </h1>
        
        <div style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '1.5rem',
          lineHeight: '1.6'
        }}>
          Calculate and visualize the relationship between drug dose and receptor occupancy.
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Drug & Brain Area</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <select 
              onChange={handleDropdownChange}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                flex: '1',
                minWidth: '200px'
              }}>
              {antiDepressantOptions.map(option => 
                <option key={option} value={option}>{option}</option>
              )}
            </select>
            <select 
              onChange={handleTargetChange}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                flex: '1',
                minWidth: '200px'
              }}>
              {targets.map(option => 
                <option key={option} value={option}>{option}</option>
              )}
            </select>
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Reduction Settings</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                Starting Dose
              </label>
              <input 
                type="number" 
                min="0" 
                max={maxDose} 
                onChange={handleStartingPoint} 
                placeholder={`Max: ${maxDose}mg`}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                Occupancy Reduction (%)
              </label>
              <select 
                onChange={handleReductionRate}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}>
                <option selected={percentagePoint===5} key={5} value={5}>5%</option>
                <option selected={percentagePoint===10} key={10} value={10}>10%</option>
                <option selected={percentagePoint===20} key={20} value={20}>20%</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                Reduction Preference
              </label>
              <select 
                onChange={handleReductionPreference}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}>
                <option selected={percentagePoint==='Relative'} key={'Relative'} value={'Relative'}>Relative</option>
                <option selected={percentagePoint==='Absolute'} key={'Absolute'} value={'Absolute'}>Absolute</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <Line height={600} width={800} data={data} options={options} />
      </div>

      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ 
          color: '#2c3e50', 
          marginBottom: '1.5rem',
          fontSize: '1.2rem',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '0.5rem'
        }}>
          Y-Axis Decrement Points
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <h5 style={{ 
              color: '#2c3e50', 
              marginBottom: '1rem',
              fontSize: '1.1rem'
            }}>
              Relative Reduction ({reductionRate}%)
            </h5>
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
                justifyContent: 'space-between'
              }}>
                <span>Starting Dose</span>
                <span style={{ fontWeight: 'bold' }}>
                  {effectiveMaxDose} mg ({((vMax * effectiveMaxDose) / (km + effectiveMaxDose)).toFixed(2)}%)
                </span>
              </li>
              {relativeValues.slice(1).map((value, index) => (
                <li key={`relative-${index}`} style={{
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Step {index + 1}</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {value.dose.toFixed(2)} mg ({value.occupancy.toFixed(2)}%)
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h5 style={{ 
              color: '#2c3e50', 
              marginBottom: '1rem',
              fontSize: '1.1rem'
            }}>
              Absolute Reduction ({reductionRate}%)
            </h5>
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
                justifyContent: 'space-between'
              }}>
                <span>Starting Dose</span>
                <span style={{ fontWeight: 'bold' }}>
                  {effectiveMaxDose} mg ({((vMax * effectiveMaxDose) / (km + effectiveMaxDose)).toFixed(2)}%)
                </span>
              </li>
              {absoluteValues.slice(1).map((value, index) => (
                <li key={`absolute-${index}`} style={{
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Step {index + 1}</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {value.dose.toFixed(2)} mg ({value.occupancy.toFixed(2)}%)
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '12px',
        marginTop: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          color: '#2c3e50',
          marginBottom: '1.5rem',
          fontWeight: '500'
        }}>
          About the Calculator
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              color: '#2c3e50',
              marginBottom: '1rem',
              fontWeight: '500'
            }}>
              The Model
            </h3>
            <p style={{
              lineHeight: '1.6',
              color: '#444',
              marginBottom: '1rem'
            }}>
              This calculator uses the Michaelis-Menten equation to model the relationship between drug dose and receptor occupancy:
            </p>
            <div style={{
              backgroundColor: '#fff',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              color: '#2c3e50'
            }}>
              V = (Vmax * [S]) / (Km + [S])
            </div>
            <p style={{
              lineHeight: '1.6',
              color: '#444'
            }}>
              Where:
              <ul style={{
                listStyleType: 'none',
                paddingLeft: '1rem',
                marginTop: '0.5rem'
              }}>
                <li>• Vmax: Maximum receptor occupancy (horizontal asymptote)</li>
                <li>• Km: Dose at which occupancy is half of Vmax</li>
                <li>• [S]: Drug dose</li>
              </ul>
            </p>
          </div>

          <div>
            <h3 style={{
              fontSize: '1.2rem',
              color: '#2c3e50',
              marginBottom: '1rem',
              fontWeight: '500'
            }}>
              How to Use
            </h3>
            <ol style={{
              paddingLeft: '1.5rem',
              color: '#444',
              lineHeight: '1.6'
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
          fontSize: '0.9rem',
          color: '#666',
          borderTop: '1px solid #e9ecef',
          paddingTop: '1rem',
          marginTop: '1rem'
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
    </div>
}

export default SimpleChart