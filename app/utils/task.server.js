import { PrismaClientKnownRequestError } from '@prisma/client'
import { z } from 'zod'
import { Category } from '@prisma/client'

import prisma from '~/utils/prisma.server'

function deleteTask(taskId) {
  return prisma.task.delete({
    where: {
      id: taskId,
    },
  })
}

async function getTasks() {
  return prisma.task.findMany({
    where: {
      disabled: false,
    },
    include: {
      author: {
        select: {
          id: true,
          displayName: true,
        },
      },
    },
  });
}

async function createNewTask(payload /*SignupInput*/) {
  try {
    const task = await this.prisma.task.create({
      data: {
        ...payload,
      },
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

function validateNewTaskInput(input) {
  let validTaskInput = z.object({
    name: z.string(),
    category: z.nativeEnum(Category),
    labels: z.string(),
    points: z.number().int().positive(),
    flag: z.string().regex(new RegExp('[0-9A-Za-z_]+$', 'm')),
    content: z.string()
  })

  return validTaskInput.safeParse(input)
}

async function validateFlag(flag) {
  // let regexp = /prefix{[0-9A-Za-z_]+}$/gm
  // "flag{[0-9A-Za-z_]+}$"gm

  let prefix = await prisma.settings.findUnique({
    where: { name: 'flag_prefix' },
    select: { value: true }
  })

  let pattern = new RegExp('prefix{[0-9A-Za-z_]+}$'.replace('prefix', prefix.value), 'm')

  // let pattern = regexp.replace('prefix', '\\' + prefix.value);

  const shema = z.string().regex(pattern);

  return shema.parseAsync(flag)
}

export { deleteTask, validateFlag, validateNewTaskInput }

