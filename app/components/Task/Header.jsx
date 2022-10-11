const Colors = new Map([
    ["WEB", "yellow"],
    ["CRYPTO", "lime"],
    ["FORENSICS", "fuchsia"],
    ["OSINT", "blue"],
    ["REVERSE", "rose"],
    ["BINARY", "red"],
    ["OTHER", "violet"],
])

export default function ({ name = 'No Title', category = 'OTHER', points = 0 }) {
    const icon = Array.from(category)[0];
    const color = Colors.get(category)
    return (
        <div className="h-10 flex flex-row">
            <div className={`flex-none h-10 w-10 bg-${color}-500 font-semibold text-base text-center text-white leading-10 capitalize rounded-sm`}>
                {icon}
            </div>
            <div className="grow ml-2 h-10">
                <p className="font-medium whitespace-nowrap text-sm">{name}</p>
                <p className="text-gray-400 text-xs">{category}</p>
            </div>
            <div className="flex-none font-medium text-2xl h-10">
                {points}
            </div>
        </div>
    )
}
