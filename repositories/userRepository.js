const { Not, MoreThanOrEqual, Brackets } = require('typeorm');
const UserStatus = require('../enums/user-status');
const VerificationTokenType = require('../enums/verification-token-type.enum');
const { BaseRepository } = require('./baseRepository');
const {User} = require('../models/userModel');
class UsersRepository extends BaseRepository {
  constructor(dataSource) {
    super(User, dataSource);
  }

  async getOneBy(where) {
    const entity = await this.findOneBy(where);
    if (!entity) {
      throw new Error;
    }
    return entity;
  }

  async getByEmail(email) {
    return await this.getOneBy({ email });
  }

  async getOne(id) {
    const entity = await this.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    return entity;
  }

  async getOneWithRelations(where, relations) {
    const entity = await this.findOne({ where, relations });
    if (!entity) {
      throw new NotFoundException();
    }
    return entity;
  }

  async getOneWithSkills(id) {
    return await this.getOneWithRelations({ id });
  }

  async getUserByEmailVerificationCode(id, code) {
    return this.getOneWithRelations(
      {
        id,
        status: UserStatus.Pending,
        tokens: {
          type: VerificationTokenType.VerifyEmail,
          token: code,
          expireAt: MoreThanOrEqual(new Date()),
        },
      },
      { tokens: true }
    );
  }

  async verifyEmail(user) {
    await this.update(user.id, {
      emailVerified: new Date(),
      status: UserStatus.Verified,
    });
    for (const token of user.tokens) {
      await token.remove();
    }
  }

  async resetPassword(user, password) {
    await this.update(user.id, { password });
    for (const token of user.tokens) {
      await token.remove();
    }
  }

  async getOneWithActiveSubscription(id) {
    return this.createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .leftJoinAndSelect('profile.profileImage', 'profileImage')
      .leftJoinAndSelect('u.progress', 'progress')
      .leftJoinAndSelect('u.socials', 'userSocials')
      .where({ id })
      .getOne();
  }

  async findActiveUserByEmail(email, relations) {
    return this.findOne({
      where: { email, status: Not(UserStatus.Blocked) },
      relations,
    });
  }

  async findActiveUser(id) {
    return this.findOne({
      where: { id, status: UserStatus.Active },
    });
  }

  async findAllPaginate({ page, limit, search }) {
    const builder = this.createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .leftJoinAndSelect('profile.profileImage', 'profileImage')
      .leftJoinAndSelect('u.progress', 'progress')
      .andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(u.name) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(u.email) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(u.username) LIKE :search', { search: `%${search}%` });
        })
      );

    return this.paginateQueryBuilder(builder, {
      page,
      limit,
      transformer,
    });
  }

  async findAllWithFriendshipsAndPagination({ page, limit, search }, userId) {
    const builder = this.createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .leftJoinAndSelect('profile.profileImage', 'profileImage')
      .leftJoinAndSelect('u.progress', 'progress')
      .where({ status: UserStatus.Active, id: Not(userId) })
      .andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(u.name) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(u.email) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(u.username) LIKE :search', { search: `%${search}%` });
        })
      );

    return this.paginateQueryBuilder(builder, {
      page,
      limit,
      transformer,
    });
  }

  async findAllFriendsWithoutPagination(userId, { page, limit, search, orderedBy }) {
    const builder = this.createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .leftJoinAndSelect('profile.profileImage', 'profileImage')
      .leftJoinAndSelect('u.progress', 'progress')
      .where({ status: UserStatus.Active })
      .andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(u.name) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(u.email) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(u.username) LIKE :search', { search: `%${search}%` });
        })
      )
      .orderBy(orderedBy);

    return this.QueryBuilderWithoutPagination(builder, {
      page,
      limit,
      transformer,
    });
  }

  async findAllGlobalPaginate(userId, { page, limit, search, orderedBy }) {
    const builder = this.createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .leftJoinAndSelect('profile.profileImage', 'profileImage')
      .leftJoinAndSelect('u.progress', 'progress')
      .where(
        new Brackets((qb) => {
          qb.where({ status: UserStatus.Active }).andWhere('u.id <> :uid', { uid: userId });
        })
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(u.name) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(u.email) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(u.username) LIKE :search', { search: `%${search}%` });
        })
      )
      .orderBy(orderedBy);

    return this.paginateQueryBuilder(builder, {
      page,
      limit,
      transformer,
    });
  }

  async findAllFriendsPaginate(userId, { page, limit, search, orderedBy }) {
    const builder = this.createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .leftJoinAndSelect('profile.profileImage', 'profileImage')
      .leftJoinAndSelect('u.progress', 'progress')
      .where({ status: UserStatus.Active })
      .andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(u.name) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(u.email) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(u.username) LIKE :search', { search: `%${search}%` });
        })
      )
      .orderBy(orderedBy);

    return this.paginateQueryBuilder(builder, {
      page,
      limit,
      transformer,
    });
  }
}

module.exports = { UsersRepository };
