import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Line } from 'react-chartjs-2';
import { registerables } from 'chart.js';
ChartJS.register(...registerables, ArcElement, Tooltip, Legend);

const SimpleChart = () => {

  const [vMax, setVmax] = useState(83.98);
  const [km, setKm] = useState(2.33);
  
  const substrateConcentration = [];
  const reactionRate = [];
  
  for (var i = 0; i <= 60; i += 1) {
    substrateConcentration.push(`${i}`);
    reactionRate.push(vMax * i / (km + i));
  }
  
  const maxRate = reactionRate[60];
  let minRate = 0;
  
  
  function generateNumbers(x: any, n: any) {
    const result = [];
    for (let i = 0; i <=n; i++) {
      result.push(i * x * 0.1);
    }
    return result;
  }

  
  const step = (80.84 - 0) * 0.1;
  const tenPercentReactionRatePoints = [];

  for (let i = 0; i <= 10; i++) {
    tenPercentReactionRatePoints.push(0 + step * i);
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
          label: 'POI',
          data: tenPercentReactionRatePoints,
          backgroundColor: 'blue',
          borderColor: 'blue',
          borderWidth: 3,
          fill: false,
        }
      ],
    };


const options = {
  // remove 'dots'
  // pointRadius: 0,
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
      <div>
        <h2><strong>Citalopram</strong> with Region of Interest <strong>Striatum</strong></h2>
      </div>
      <div>
        Graph is based on Michaelis-Menten equation: <strong>V = Vmax * [S] / (Km + [S])</strong> <br/><br/>
      </div>
      <div style={{
        display: 'flex'
      }}>
      <strong>Vmax: </strong>
      {/* @ts-ignore */}
      <input type="number" placeholder='vmax input' value={vMax} onChange={(e)=> setVmax(e.target.value)}/>
      <strong>{' '}Km:</strong>
      {/* @ts-ignore */}
      <input placeholder='Km input' type="number" value={km} onChange={(e)=> setKm(e.target.value)}/>
      </div>
      <br/><br/>
      <div>
        {/* @ts-ignore */}
        <Line height={600} width={800} data={data} options={options} />
      </div>
    </div>
}

export default SimpleChart