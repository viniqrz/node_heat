import prismaClient from '../prisma';

export class ProfileUserService {
  async execute(userId: string) {
    const user = await prismaClient.user.findFirst({
      where: { id: userId },
    });

    return { user };
  }
}
