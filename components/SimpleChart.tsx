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
      const startDose = startingPoint;
      const startOccupancy = (vMax * startDose) / (km + startDose); // Calculate initial occupancy
      const reductionAmount = startOccupancy * (reductionRate / 100); // Calculate reduction amount based on starting occupancy
      
      let currentDose = startDose;
      let currentOccupancy = startOccupancy;
      
      while (currentDose > 0.1) { // Stop when dose is very small
        values.push({
          dose: currentDose,
          occupancy: currentOccupancy
        });
        currentOccupancy = currentOccupancy - reductionAmount; // Subtract the same amount each time
        // Calculate the corresponding dose for the new occupancy
        currentDose = (km * currentOccupancy) / (vMax - currentOccupancy);
      }
      return values;
    };

    // Calculate absolute reduction values
    const getAbsoluteReductionValues = () => {
      if (!startingPoint) return [];
      const values = [];
      const startDose = startingPoint;
      const startOccupancy = (vMax * startDose) / (km + startDose); // Calculate initial occupancy
      
      // Get all possible doses for the drug
      const allDoses = getDoseForOccupancyIncrements(selectedAntiDepressant, selectedTarget, percentagePoint)
        .filter(value => value <= effectiveMaxDose);
      
      // Start with the initial dose
      values.push({
        dose: startDose,
        occupancy: startOccupancy
      });

      // For each step, find the closest dose that gives us the next reduction
      let currentOccupancy = startOccupancy;
      for (let i = 0; i < allDoses.length; i++) {
        const targetOccupancy = currentOccupancy - reductionRate;
        if (targetOccupancy <= 0) break;

        // Find the closest dose that gives us the target occupancy
        const closestDose = allDoses.reduce((prev, curr) => {
          const prevOccupancy = (vMax * prev) / (km + prev);
          const currOccupancy = (vMax * curr) / (km + curr);
          return Math.abs(currOccupancy - targetOccupancy) < Math.abs(prevOccupancy - targetOccupancy) ? curr : prev;
        });

        const closestOccupancy = (vMax * closestDose) / (km + closestDose);
        values.push({
          dose: closestDose,
          occupancy: closestOccupancy
        });
        currentOccupancy = closestOccupancy;
      }
      
      return values;
    };

    const relativeValues = getRelativeReductionValues();
    const absoluteValues = getAbsoluteReductionValues();
    
    const occupancyIncrements = absoluteValues.map((value, index) => ({
      x: parseFloat(value.dose),
      y: value.occupancy,
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
    

    return <div>
      <h3>
        Graph is based on Michaelis-Menten equation: <strong>V = Vmax * [S] / (Km + [S])</strong> <br/><br/>
        The relationship between dose and serotonin transporter occupancy of antidepressants—a systematic review: <a href="https://www.nature.com/articles/s41380-021-01285-w#Sec7">reference</a>
      </h3>
        <div>
        <strong>Drug & Brain Area: </strong> <select onChange={handleDropdownChange}>
        {antiDepressantOptions.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      <select onChange={handleTargetChange}>
        {targets.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      <br/>
      <strong>Approach: </strong> <select onChange={handleApproachChange}>
        {getApproachOptions(currApproach).map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      <select onChange={handleReductionChange}>
        {getReductionApproachOptions(currApproach).map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      </div>
      <div>
      <strong>Incerment Point % (Y Axis)</strong>:{' '} 
      <select onChange={handlePercentagePoint}>
        <option selected={percentagePoint===5} key={5} value={5}>5</option>
        <option selected={percentagePoint===10} key={10} value={10}>10</option>
        <option selected={percentagePoint===20} key={20} value={20}>20</option>
      </select>
      </div>
      <div>
      <strong>Starting Point</strong>:{' '}
      <input type="number" min="0" max={maxDose} onChange={handleStartingPoint} placeholder={`Max: ${maxDose}mg`}/>
      </div>
      <div>
      <strong>Occupancy Reduction (%)</strong>:{' '}
        <select onChange={handleReductionRate}>
          <option selected={percentagePoint===5} key={5} value={5}>5</option>
          <option selected={percentagePoint===10} key={10} value={10}>10</option>
          <option selected={percentagePoint===20} key={20} value={20}>20</option>
        </select>
      </div>
      <div>
      <strong>Reduction Preference</strong>:{' '}
        <select onChange={handleReductionPreference}>
          <option selected={percentagePoint==='Relative'} key={'Relative'} value={'Relative'}>Relative</option>
          <option selected={percentagePoint==='Absolute'} key={'Absolute'} value={'Absolute'}>Absolute</option>
        </select>
      </div>
      <strong>Vmax: {vMax}</strong>
      <br/>
      <strong>{' '}Km: {km}</strong>
     
      <div>
      <h4>Y-Axis decrement points</h4>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <h5>Relative Reduction ({reductionRate}%)</h5>
          <ol>
            <li key="relative-start">
              {effectiveMaxDose} mg ({(vMax * effectiveMaxDose) / (km + effectiveMaxDose).toFixed(2)}%)
            </li>
            {relativeValues.slice(1).map((value, index) => (
              <li key={`relative-${index}`}>
                {value.dose.toFixed(2)} mg ({value.occupancy.toFixed(2)}%)
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h5>Absolute Reduction ({reductionRate}%)</h5>
          <ol>
            <li key="absolute-start">
              {effectiveMaxDose} mg ({(vMax * effectiveMaxDose) / (km + effectiveMaxDose).toFixed(2)}%)
            </li>
            {absoluteValues.slice(1).map((value, index) => (
              <li key={`absolute-${index}`}>
                {value.dose.toFixed(2)} mg ({value.occupancy.toFixed(2)}%)
              </li>
            ))}
          </ol>
        </div>
      </div>
      </div>
      <br/><br/>
      <div>
        <Line height={600} width={800} data={data} options={options} />
      </div>
      {/* Hyperbolic Tapering Schedule Table */}
      <div style={{ marginTop: '2rem' }}>
        <h4>Hyperbolic Tapering Schedule</h4>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Step</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Dose (mg)</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Occupancy (%)</th>
            </tr>
          </thead>
          <tbody>
            {/* Show max dose as first row */}
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>Starting Dose</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{effectiveMaxDose}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{((vMax * effectiveMaxDose) / (km + effectiveMaxDose)).toFixed(2)}</td>
            </tr>
            {/* Show each reduction step */}
            {absoluteValues.slice(1).map((value, idx) => (
              <tr key={idx + 1}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{idx + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{value.dose.toFixed(2)}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{value.occupancy.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
}

export default SimpleChart