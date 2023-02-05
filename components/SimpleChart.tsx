"use client"
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

    for (var i = 0; i <= 60; i+=10) {
    substrateConcentration.push(i);
    reactionRate.push(vMax * i / (km + i));
    }

const data = {
  labels: substrateConcentration,
  datasets: [
    {
      label: 'Occupancy (%)',
      data: reactionRate,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      fill: false,
    },
  ],
};

const options = {
  responsive: true,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false
      },
    },
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
  tooltips: {
    callbacks: {
      label: (tooltipItem: any, data: any) => {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const index = tooltipItem.index;
        return `Substrate Concentration: ${data.labels[index]} 
                Reaction Rate: ${dataset.data[index]}`;
      },
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
      <strong>Vmax: </strong>
      {/* @ts-ignore */}
      <input type="number" placeholder='vmax input' value={vMax} onChange={(e)=> setVmax(e.target.value)}/>
      <strong>{' '}Km:</strong>
      {/* @ts-ignore */}
      <input placeholder='Km input' type="number" value={km} onChange={(e)=> setKm(e.target.value)}/>
      <br/><br/>
      <div>
        {/* @ts-ignore */}
        <Line height={200} width={800} data={data} options={options} />
      </div>
    </div>
}

export default SimpleChart