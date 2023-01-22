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
            <p className='mb-5 md:text-lg whitespace-nowrap'>Starts in</p>
            <div className='flex flex-row flex-nowrap items-center'>

                <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-white/50 rounded-lg opacity-80 px-2">
                    <p className="text-xl">{duration.days()}</p>
                    <span className=" text-xs pb-1">days</span>
                </div>
                <div className='px-3'>:</div>

                <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-white/50 rounded-lg opacity-80 px-2">
                    <p className="text-xl">{duration.hours()}</p>
                    <span className=" text-xs pb-1">hours</span>
                </div>
                <div className='px-3'>:</div>

                <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-white/50 rounded-lg opacity-80 px-2">
                    <p className="text-xl">{duration.minutes()}</p>
                    <span className=" text-xs pb-1">minutes</span>
                </div>
                <div className='px-3'>:</div>

                <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-white/50 rounded-lg opacity-80 px-2">
                    <p className="text-xl">{duration.seconds()}</p>
                    <span className=" text-xs pb-1">seconds</span>
                </div>
            </div>

        </div>
    );
};

export default CountdownTimer