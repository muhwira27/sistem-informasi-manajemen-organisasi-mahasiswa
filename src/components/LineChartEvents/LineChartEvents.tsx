import React, { useRef, useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Timestamp } from 'firebase/firestore';
import { getAllData } from '../../firebase/firestoreService';
import './LineChartEvents.css';

Chart.register(...registerables);

interface Event {
  id: number;
  start_date: Timestamp
}

const LineChartEvents: React.FC = () => {
  const [eventList, setEventList] = useState<Event[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldRefetch, setShouldRefetch] = useState(true);

  const fetchEvent = async () => {
    const data = await getAllData('event_list');
    setEventList(data);
  };

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }): string => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('id-ID', {
      month: 'long',
    });
  };

  useEffect(() => {
    if (shouldRefetch) {
      fetchEvent();
      setShouldRefetch(false)
    }
  }, [shouldRefetch]);

  const countEventsPerMonth = (events: Event[]) => {
    const eventCounts: { [key: string]: number } = {
      'Januari': 0,
      'Februari': 0,
      'Maret': 0,
      'April': 0,
      'Mei': 0,
      'Juni': 0,
      'Juli': 0,
      'Agustus': 0,
      'September': 0,
      'Oktober': 0,
      'November': 0,
      'Desember': 0
    };

    events.forEach(event => {
      const month = formatDate(event.start_date);
      eventCounts[month] = (eventCounts[month] || 0) + 1;
    });

    return eventCounts;
  };

  useEffect(() => {
    if (canvasRef.current && eventList.length > 0) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const counts = countEventsPerMonth(eventList);
        const sortedMonths = Object.keys(counts).sort((a, b) =>
          new Date(a).getTime() - new Date(b).getTime()
        ); // Ensure months are sorted correctly
        const data = {
          labels: sortedMonths,
          datasets: [{
            label: 'Jumlah Kegiatan',
            data: sortedMonths.map(month => counts[month]), // Map sorted labels to data
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        };

        const config = {
          type: 'line',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Tren Kegiatan Bulanan',
                font: {
                  size: 20
                },
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            }
          }
        };

        const lineChart = new Chart(ctx, config);

        // Cleanup chart on unmount
        return () => lineChart.destroy();
      }
    }
  }, [eventList]);

  return (
    <div className='line-chart-container'>
      <canvas className='line-chart' ref={canvasRef}></canvas>
    </div>
  );
};

export default LineChartEvents;
