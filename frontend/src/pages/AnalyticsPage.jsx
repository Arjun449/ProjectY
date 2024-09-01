import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AnalyticsPage = () => {
    const [taskStats, setTaskStats] = useState({});

    useEffect(() => {
        const fetchTaskStats = async () => {
            const res = await axios.get('/api/tasks/stats');
            setTaskStats(res.data);
        };

        fetchTaskStats();
    }, []);

    const data = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
            {
                label: 'Tasks by Priority',
                data: [
                    taskStats.lowPriority || 0,
                    taskStats.mediumPriority || 0,
                    taskStats.highPriority || 0,
                ],
                backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
            },
        ],
    };

    return (
        <div className="analytics-page">
            <h2>Task Analytics</h2>
            <Bar data={data} />
        </div>
    );
};

export default AnalyticsPage;
