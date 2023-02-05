"use client"
import React, { useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from 'react-chartjs-2';
import { registerables } from 'chart.js';
ChartJS.register(...registerables);


const SimpleChart = () => {

    const [vMax, setVmax] = useState(83.98);
    const [km, setKm] = useState(2.33);

    const substrateConcentration = [];
    const reactionRate = [];

    for (var i = 0; i <= 100; i++) {
    substrateConcentration.push(i);
    reactionRate.push(vMax * i / (km + i));
    }

const data = {
  labels: substrateConcentration,
  datasets: [
    {
      label: 'Reaction rate',
      data: reactionRate,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      fill: false,
    },
  ],
};

const options = {
  scales: {
    xAxes: [
      {
        type: 'linear',
        position: 'bottom',
        scaleLabel: {
          display: true,
          labelString: 'Substrate Concentration',
        },
      },
    ],
    yAxes: [
      {
        type: 'linear',
        scaleLabel: {
          display: true,
          labelString: 'Reaction Rate',
        },
      },
    ],
  },
};

    return <div>
      <div>
        <h2><strong>Citalopram</strong> with Region of Interest <strong>Striatum</strong></h2>
      </div>
      <div>
        Graph is based on Michaelis-Menten equation: <strong>V = Vmax * [S] / (Km + [S])</strong> <br/><br/>
      </div>
      <span>Vmax: </span>
      {/* @ts-ignore */}
      <input type="number" placeholder='vmax input' value={vMax} onChange={(e)=> setVmax(e.target.value)}/>
      <span>Km:</span>
      {/* @ts-ignore */}
      <input placeholder='Km input' type="number" value={km} onChange={(e)=> setKm(e.target.value)}/>
      <br/><br/>
      <div style={{maxHeight: '50rem'}}>
        {/* @ts-ignore */}
        <Line data={data} options={options} />
      </div>
    </div>
}

export default SimpleChart