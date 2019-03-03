import React from 'react';
import { Bar as BarChart } from 'react-chartjs';


const BOOKINGS_BUCKET = {
    cheap: {
        min: 0,
        max: 99,
    },
    normal: {
        min: 100,
        max: 199,
    },
    expensive: {
        min: 200,
        max: 99999999,
    }
};

const bookingChart = props => {
    const chartData = {
        labels: [],
        datasets: [],
    };

    let values = [];

    for (const bucket in BOOKINGS_BUCKET) {
        const filteredBookingCount = props.bookings.reduce((prev, current) => {
            if (current.event.price >= BOOKINGS_BUCKET[bucket].min &&
                current.event.price <= BOOKINGS_BUCKET[bucket].max) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);

        values.push(filteredBookingCount);

        chartData.labels.push(bucket);
        chartData.datasets.push({
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: values
        });

        
        values = [...values];
        values[values.length - 1] = 0;
    }

    return (
        <div className='d-flex justify-content-center'>
            <BarChart data={chartData} />
        </div>
    );
}

export default bookingChart;
