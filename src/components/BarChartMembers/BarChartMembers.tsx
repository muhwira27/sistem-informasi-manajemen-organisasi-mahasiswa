import React, { useRef, useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { getAllData } from '../../firebase/firestoreService';
import './BarChartMembers.css';

Chart.register(...registerables);

const BarChartMembers: React.FC = () => {
  const [memberList, setmemberList] = useState([])
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldRefetch, setShouldRefetch] = useState(true);

  const fetchMembers = async () => {
    const data = await getAllData('member_list');
    setmemberList(data);
  };

  useEffect(() => {
    if (shouldRefetch) {
      fetchMembers();
      setShouldRefetch(false)
    }
  }, [shouldRefetch]);

  // Fungsi untuk mendapatkan nama fakultas berdasarkan awalan NIM
  const getFacultyName = (nim: string) => {
    const prefixMap: { [key: string]: string } = {
      'A': 'Ekonomi dan Bisnis',
      'B': 'Hukum',
      'C': 'Kedokteran',
      'D': 'Teknik',
      'E': 'Ilmu Sosial dan Ilmu Politik',
      'F': 'Ilmu Budaya',
      'G': 'Pertanian',
      'H': 'MIPA',
      'I': 'Peternakan',
      'J': 'Kedokteran Gigi',
      'K': 'Kesehatan Masyarakat',
      'L': 'Kelautan dan Perikanan',
      'M': 'Kehutanan',
      'N': 'Farmasi',
      'R': 'Keperawatan',
      'P': 'Pascasarjana',
      'V': 'Vokasi'
    };
    return prefixMap[nim[0]] || 'Lainnya';
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Menghitung jumlah anggota per fakultas berdasarkan NIM
        const counts = memberList.reduce((acc: { [key: string]: number }, val: Record<string, string>) => {
          const facultyName = getFacultyName(val.nim);
          acc[facultyName] = (acc[facultyName] || 0) + 1;
          return acc;
        }, {});

        // Mengubah objek menjadi array, mengurutkannya, dan mengambil 5 teratas
        const sortedFaculties = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const topFaculties = sortedFaculties.slice(0, 5);
        const otherFaculties = sortedFaculties.slice(5);

        // Menghitung jumlah untuk kategori "Lainnya"
        const otherCount = otherFaculties.reduce((sum, faculty) => sum + faculty[1], 0);

        // Menyiapkan label dan data untuk grafik, termasuk "Lainnya"
        const chartLabels = topFaculties.map(faculty => faculty[0]);
        const chartData = topFaculties.map(faculty => faculty[1]);
        if (otherCount > 0) {
          chartLabels.push('Lainnya');
          chartData.push(otherCount);
        }

        const data = {
          labels: chartLabels,
          datasets: [{
            label: 'Jumlah Anggota',
            data: chartData,
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#ffa500"],
          }],
        };

        // Konfigurasi untuk grafik batang
        const config = {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Distribusi Anggota per Fakultas',
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
          },
        };

        // Membuat instance grafik
        const barChart = new Chart(ctx, config);

        // Cleanup chart on unmount
        return () => barChart.destroy();
      }
    }
  }, [memberList]);

  return (
    <div className='member-chart-container'>
      <canvas className='member-chart' ref={canvasRef} />
    </div>
  );
};

export default BarChartMembers;
