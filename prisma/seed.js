const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');
const yaml = require('js-yaml');
const fs = require('fs');

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
    const data = yaml.load(fs.readFileSync('./challenges/data.yml', 'utf8'));
    
    console.log(data.challenges)

    await prisma.$queryRaw`SET TIMEZONE="Europe/Moscow";`

    const names = ['THDMAX', 'rmnvlv', 'r4r3g0d', 'Nixes', 'simen']
    const admins = await Promise.all(
        names.map(function (name) {
            return prisma.player.create({
                data: {
                    email: name.toLowerCase() + '@borda.com',
                    displayName: name,
                    password: 'password',
                    role: Role.ADMIN
                },
            })
        })
    )

    const tasks = await Promise.all(
        data.challenges.map((task) => {
            return prisma.task.upsert({
                where: {
                    name: task.title,
                },
                update: {
                    content: task.description,
                    category: task.category.toUpperCase(),
                    points: task.points,
                    flag: task.flag,
                },
                create: {
                    name: task.title,
                    content: task.description,
                    category: task.category.toUpperCase(),
                    points: task.points,
                    flag: task.flag,
                    author: {
                        connect: {
                            email: admins[Math.floor(Math.random() * admins.length)].email,
                        }
                    },
                },
            })
        })
    )

    const id = admins[Math.floor(Math.random() * admins.length)].id
    adminTeam = await prisma.team.create({
        data: {
            name: 'Admin Team',
            captainId: id,
            players: {
                connect: [
                    { id: admins[0].id },
                    { id: admins[1].id },
                    { id: admins[2].id },
                    { id: admins[3].id },
                    { id: admins[4].id }
                ],
            },
        }
    })

    await prisma.settings.createMany({
        data: [
            { name: "flag_prefix", value: "flag" },
        ]
    })

    await prisma.event.create({
        data:{
            name: 'Admiral Makarov CTF 2022',
            startDate: new Date('December 1, 2022 11:00:00 GMT+03:00'),
            endDate: new Date('December 1, 2022 22:00:00 GMT+03:00'),
            location: "Online",
            format: 'Task-based'
        }
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