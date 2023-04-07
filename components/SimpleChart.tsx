// @ts-nocheck
import React, { useState } from 'react';
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
  
    const reductionValues = getDoseForOccupancyIncrements(selectedAntiDepressant, selectedTarget, percentagePoint)
    const occupancyIncrements = reductionValues.map((value, index) => ({
      x: parseFloat(value),
      y: (index + 1) * percentagePoint,
    }));

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
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 3,
          fill: false,
        },
          {
            label: 'Occupancy Difference',
            data: occupancyDifference,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 3,
            fill: 'none',
          },
          {
            label: 'Increment Point',
            data: occupancyIncrements,
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 3,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
      ],
    };
    

    return <div>
      <h3>
        Graph is based on Michaelis-Menten equation: <strong>V = Vmax * [S] / (Km + [S])</strong> <br/><br/>
        The relationship between dose and serotonin transporter occupancy of antidepressants—a systematic review: <a href="https://www.nature.com/articles/s41380-021-01285-w#Sec7">reference</a>
      </h3>
        <strong>Vmax: {vMax}</strong>
        <br/>
        <strong>{' '}Km: {km}</strong>
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
      <h4>{percentagePoint}% Y-Axis increment points</h4>
      <ol>
        {reductionValues.map((value, index) => (
          <li key={index}>
            {value} mg
          </li>
        ))}
      </ol>
      </div>
      <br/><br/>
      <div>
        <Line height={600} width={800} data={data} options={options} />
      </div>
    </div>
}

export default SimpleChart