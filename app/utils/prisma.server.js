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

export default prisma;

prisma.$use(async (params, next) => {
    if (params.action == 'create' && params.model == 'Player') {
        const player = params.args.data;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(player.password, salt);
        player.password = hash;
        params.args.data = player;
      }
      return next(params);
  });