const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
    if (params.action == 'create' && params.model == 'Player') {
        let player = params.args.data;
        const hash = await bcrypt.hash(player.password, 10);
        player.password = hash;
        params.args.data = player;
    }
    return next(params);
});

function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(function () {
        return 0.5 - Math.random()
    })

    return shuffled.slice(0, num);
}

async function main() {
    await prisma.$queryRaw`SET TIMEZONE="Europe/Moscow";`

    const names = ['max', 'simen', 'nikita', 'vova', 'roma']
    const roles = [Role.ADMIN, Role.PLAYER]
    const players = await Promise.all(
        names.map(function (name) {
            return prisma.player.create({
                data: {
                    email: name + '@borda.com',
                    displayName: name.toUpperCase(),
                    password: 'password',
                    role: roles[Math.floor(Math.random() * roles.length)],
                    // score: 0, rmnvlv
                }
            })
        })
    );

    const categories = ["WEB", "CRYPTO", "FORENSICS", "OSINT", "REVERSE", "BINARY", "OTHER"]
    const indexies = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const tasks = await Promise.all(
        indexies.map((number) => {
            return prisma.task.create({
                data: {
                    name: "Task " + number,
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in magna eget sem volutpat efficitur.',
                    category: categories[Math.floor(Math.random() * categories.length)],
                    points: Math.ceil(Math.random() * 10) * 100,
                    flag: "flag{some_flag}",
                    hint: "Hint...",
                    author: {
                        connect: {
                            email: players[Math.floor(Math.random() * players.length)].email,
                        }
                    },
                    // solutionsCounter: 0, альтернативный вариант
                }
            })
        })
    );

    const teamNames = ["Drochers", "4fk_H4ck3r5"]
    const teams = await Promise.all(
        teamNames.map((name) => {
            const playerId = players[Math.floor(Math.random() * players.length)].id
            return prisma.team.create({
                data: {
                    name: name,
                    captainId: playerId,
                    players: {
                        connect: [{ id: playerId }],
                    },
                }
            })
        })
    );

    await prisma.settings.createMany({
        data: [
            { name: "flag_prefix", value: "flag" },
            { name: "start", value: "1668330000000" },
            { name: "finish", value: "1668070800000" },
        ]
    })

    playerWithTeams = await prisma.player.findMany({
        include: { team: { select: { name: true } } }
    })

    console.log(`Created ${playerWithTeams.length} players`)
    playerWithTeams.forEach(function (player) {
        console.log(`${player.displayName}: ${player.role}, Team: ${player.team?.name}`)
    })
}

main()
    .then(async function () {
        await prisma.$disconnect()
    })
    .catch(async function (e) {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })