import React, { useEffect, useState } from 'react';
import moment from 'moment';

const Clock = () => {
    const [currentTime, setCurrentTime] = useState(moment());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(moment());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const gmtMinus5Time = currentTime.utcOffset(-5);

    return (
        <div>
            <p>Hora: {gmtMinus5Time.format('YYYY-MM-DD h:mm:ss A')}</p>
        </div>
    );
};

export default Clock;
