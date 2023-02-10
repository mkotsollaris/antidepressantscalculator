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
          maxDose: 60
        }
      }
    ]
  },
  Desvenlafaxine: {
    targets: [
      {
        Striatum: {
          maxDose: 140
        },
        Amygdala: {
          maxDose: 140
        },
        Midbrain: {
          maxDose: 140
        },
        Thalamus: {
          maxDose: 140
        }
      }
    ]
  },
  Duloxetine: {
    targets: [{
      Thalamus: {
        maxDose: 60
      }
    }]
  },
  Escitalopram: {
    targets: [
      {
        Caudate: {
          maxDose: 30
        }
      },
      {
        Dorsal_Raphe_Nucleus: {
          name: 'Dorsal Raphe Nucleus',
          maxDose: 30
        }
      },
      {
        Putamen: {
          maxDose: 30
        }
      },
      {
        Escitalopram: {
          maxDose: 30
        }
      }
    ]
  },
  Fluoxetine: {
    targets: [
      {
        Striatum: {
          maxDose: 60
        }
      }
    ]
  },
  Paroxetine: {
    targets: [{
      Striatum: {
          maxDose: 60
      }
    }]
  },
  Sertaline: {
    targets: [
      {
        Striatum: {
          maxDose: 200
        }
      }
    ]
  },
  Venlafaxine_XR: {
    targets: [
      {
        Striatum: {
          maxDose: 200
        }
      }
    ]
  },
  Vortioxetine: {
    targets: [
      {
        Raphe_Nuclei: {
          maxDose: 60
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

    const [vMax, setVmax] = useState(83.98);
    const [km, setKm] = useState(2.33);
    const substrateConcentration = [];
    const reactionRate = [];
    const [selectedAntiDepressant, setSelectedAntiDepressant] = useState("Citalopram")
    const [selectedTarget, setSelectedTarget] = useState("Striatum")
    const [targets, setTargets] = useState(getTargets("Citalopram"))

    const handleDropdownChange = (e: any) => {
      setSelectedAntiDepressant(e.target.value);
      setTargets(getTargets(e.target.value));
      setSelectedTarget(getFirstTarget(e.target.value));
    }

    const handleTargetChange = (e: any) => {
      setSelectedTarget(e.target.value)
    }

    const antiDepressantOptions = Object.keys(antiDepressantData).map(e => e)
    const maxDose = getMaxDose(selectedAntiDepressant, selectedTarget);

    for (var i = 0; i <= maxDose; i+=1) {
      substrateConcentration.push(`${i}`);
      reactionRate.push(vMax * i / (km + i));
    }

    const occupancyDifference = [];
    occupancyDifference.push(reactionRate[0]);

    for (var i = 10; i <= reactionRate.length; i+=10) {
      occupancyDifference.push(reactionRate[i] - reactionRate[i - 10]);
    }
    
    const data = {
      labels: substrateConcentration.filter((_, i) => i % 10 === 0),
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
          fill: false,
        },
      ],
    };
    

const options = {
  pointRadius: 0,
  responsive: true,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Drug Dose (mg)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Receptor Occupancy (%)'
        }
      },
    },
};

    return <div>
      <h3>
        Graph is based on Michaelis-Menten equation: <strong>V = Vmax * [S] / (Km + [S])</strong> <br/><br/>
        The relationship between dose and serotonin transporter occupancy of antidepressants—a systematic review: <a href="https://www.nature.com/articles/s41380-021-01285-w#Sec7">reference</a>
      </h3>
      <div style={{
        display: 'flex'
      }}>
      <strong>Vmax: </strong>
      <input type="number" placeholder='vmax input' value={vMax} onChange={(e)=> setVmax(e.target.value)}/>
      <strong>{' '}Km:</strong>
      <input placeholder='Km input' type="number" value={km} onChange={(e)=> setKm(e.target.value)}/>
      <select onChange={handleDropdownChange}>
        {antiDepressantOptions.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      <select onChange={handleTargetChange}>
        {targets.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      </div>
      <br/><br/>
      <div>
        <Line height={600} width={800} data={data} options={options} />
      </div>
    </div>
}

export default SimpleChart