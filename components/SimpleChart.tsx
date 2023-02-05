"use client"
import React, { useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from 'react-chartjs-2';
import { registerables } from 'chart.js';
ChartJS.register(...registerables);


const SimpleChart = () => {

    const [vMax, setVmax] = useState(100);
    const [km, setKm] = useState(50);

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
            Graph is based on Michaelis-Menten equation: <strong>V = Vmax * [S] / (Km + [S])</strong> <br/><br/><br/><br/>
        </div>
        <span>Vmax: </span>
        <input placeholder='vmax input' value={vMax} onChange={(e)=> setVmax(Number(e.target.value))}/>
        <span>Km:</span>
        <input placeholder='Km input'  value={km} onChange={(e)=> setKm(Number(e.target.value))}/>
        <Line data={data} options={options} />
    </div>
}

export default SimpleChart