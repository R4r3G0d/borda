import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

prisma.$use(async function (params, next) {
    if (params.action == 'create' && params.model == 'Player') {
        let player = params.args.data;
        const hash = await bcrypt.hash(player.password, 10);
        player.password = hash;
        params.args.data = player;
    }
    return next(params);
});

export default prisma;