import * as React from 'react'
import moment from 'moment-timezone'
import clsx from 'clsx'

const CountdownTimer = ({ time, className }) => {
    // let interval = 1000; // 1 second

    // calculate difference between two times
    let eventTime = moment.tz(time, "Europe/Moscow");

    // based on time set in user's computer time / OS
    let currentTime = moment.tz();

    // get duration between two times
    let duration = moment.duration(eventTime.diff(currentTime));

    // Так и не понял почему оно работает
    const [timer, setTimer] = React.useState(0)

    React.useEffect(() => {
        const interval = setInterval(function () {
            duration = moment.duration(duration - 1000, 'milliseconds')
            setTimer(duration)
        }, 1000)
        return () => clearInterval(interval)
    }, []);

    return (
        <div className={clsx('', className)}>
            <p className='text-2xl mb-5 whitespace-nowrap'>Starts in</p>
            <div className='flex flex-row flex-nowrap items-center'>

                <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-gray-500 rounded-lg opacity-80 px-2">
                    <p className="text-2xl">{duration.days()}</p>
                    <span className=" text-xs pb-1">days</span>
                </div>
                <div className='px-3'>:</div>

                <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-gray-500 rounded-lg opacity-80 px-2">
                    <p className="text-2xl">{duration.hours()}</p>
                    <span className=" text-xs pb-1">hours</span>
                </div>
                <div className='px-3'>:</div>

                <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-gray-500 rounded-lg opacity-80 px-2">
                    <p className="text-2xl">{duration.minutes()}</p>
                    <span className=" text-xs pb-1">minutes</span>
                </div>
                <div className='px-3'>:</div>

                <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-gray-500 rounded-lg opacity-80 px-2">
                    <p className="text-2xl">{duration.seconds()}</p>
                    <span className=" text-xs pb-1">seconds</span>
                </div>
            </div>

        </div>
    );
};

export { CountdownTimer }

const Timer = ({ start, finish }) => {
    const [days, setDays] = React.useState(0)
    const [hours, setHours] = React.useState(0)
    const [minutes, setMinutes] = React.useState(0)
    const [seconds, setSeconds] = React.useState(0)

    let isStarted

    const getTime = () => {
        if (Date.now() < (start)) {
            const time = (start) - Date.now()
            setDays(Math.floor(time / (1000 * 60 * 60 * 24)))
            setHours(Math.floor((time / (1000 * 60 * 60)) % 24))
            setMinutes(Math.floor((time / 1000 / 60) % 60))
            setSeconds(Math.floor((time / 1000) % 60))
        } else {
            const time = (finish) - Date.now()
            setDays(Math.floor(time / (1000 * 60 * 60 * 24)))
            setHours(Math.floor((time / (1000 * 60 * 60)) % 24))
            setMinutes(Math.floor((time / 1000 / 60) % 60))
            setSeconds(Math.floor((time / 1000) % 60))
        }
    };
    React.useEffect(() => {
        const interval = setInterval(() => getTime(start), 1000)
        return () => clearInterval(interval)
    }, []);

    const tags = [{ label: 'days', value: days }, { label: 'hours', value: hours }, { label: 'minutes', value: minutes }, { label: 'seconds', value: seconds }]
    const result = []

    tags.forEach(function (tag, index) {
        return result.push(
            <div className="w-12 flex flex-col items-center justify-center h-full border border-gray-500 rounded-lg opacity-80 px-2" key={index}>
                <p className="text-xl leading-6">{tag.value < 10 ? "0" + tag.value : tag.value}</p>
                <span className="capitalize text-custom pb-1">{tag.label}</span>
            </div>
        )
    })

    // if ( isStarted = false : isStarted = true
    isStarted = (Date.now() < start)

    return (
        <>
            <div className="h-full py-2 flex items-center justify-center">
                {isStarted ? <p>Time to end:</p> : <p>Time to start:</p>}
                {result}
            </div>
        </>
    );
};

export default Timer;


