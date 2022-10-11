import { hashPassword } from '~/utils/auth.server'
import { PrismaClientKnownRequestError } from '@prisma/client';


async function createPlayer(payload /*SignupInput*/) {
  const hashedPassword = await hashPassword(payload.password);

  try {
    const user = await this.prisma.player.create({
      data: {
        ...payload,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return this.generateTokens({
      userId: user.id,
    });
  } catch (e) {
    if (
      e instanceof PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      throw new ConflictException(`Email ${payload.email} already used.`);
    }
    throw new Error(e);
  }
}

function validateUser(userId) {
  return prisma.user.findUnique({ where: { id: userId } });
}