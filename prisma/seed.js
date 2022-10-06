const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt')
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

async function main() {
    await prisma.$queryRaw`SET TIMEZONE="Europe/Moscow";`

    const names = ['max', 'simen', 'nikita', 'vova', 'roma']
    const players = await Promise.all(
        names.map((name) => {
            return prisma.player.create({
                data: {
                    email: name + '@borda.com',
                    displayName: name.toUpperCase(),
                    password: 'password',
                    role: Role.ADMIN,
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
                    }
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
    console.log({ players, tasks, teams })

    await prisma.settings.create({ data: { name: "flag_prefix", value: "flag" } })
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