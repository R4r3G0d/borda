import { PrismaClientKnownRequestError } from '@prisma/client';
import prisma from '~/utils/prisma.server';
import { validate, ValidationErrors } from 'validate.js';
import { Schema, z } from "zod";

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

async function validateFlag(flag) {
  // let regexp = /prefix{[0-9A-Za-z_]+}$/gm
  // "flag{[0-9A-Za-z_]+}$"gm

  let prefix = await prisma.settings.findUnique({
    where: { name: 'flag_prefix' },
    select: { value: true }
  })

  let pattern = new RegExp('prefix{[0-9A-Za-z_]+}$'.replace('prefix', prefix.value), 'm')

  // let pattern = regexp.replace('prefix', '\\' + prefix.value);

  console.log({ pattern , prefix });

  const shema = z.string().regex(pattern);

  return shema.parseAsync(flag)

  // return validate({ flag }, {
  //   flag: {
  //     format: pattern,
  //     presence: { allowEmpty: false }
  //   }
  // }).catch(ValidationErrors, function (error) {
  //   // Handle the validation errors
  //   console.log("ValidationErrors", error);
  // })
  //   .catch(function (error) {
  //     // Handle other errors;
  //     console.log("SystemError", error);
  //   });
}

export { deleteTask, validateFlag }

