import * as React from 'react'

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
            <div className="h-full py-2 flex items-center justify-center space-x-3">
                {isStarted ? <p>Time to end:</p> : <p>Time to start:</p>}
                {result}
            </div>
        </>
    );
};

export default Timer;