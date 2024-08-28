class BaseRepository {
    constructor(model) {
      this.model = model;
      this.DEFAULT_LIMIT = 10;
      this.DEFAULT_PAGE = 1;
    }
  
    async paginate({ page = this.DEFAULT_PAGE, limit = this.DEFAULT_LIMIT, ...searchOptions }) {
      const skip = limit * (page - 1);
      const query = this.model.find(searchOptions).skip(skip).limit(limit);
  
      const [items, total] = await Promise.all([
        query.exec(),
        this.model.countDocuments(searchOptions).exec(),
      ]);
  
      return {
        items,
        total,
        page,
        limit,
      };
    }
  
    async queryWithoutPagination(query, { page = this.DEFAULT_PAGE, limit = this.DEFAULT_LIMIT }) {
      const items = await query.exec();
      const total = await this.model.countDocuments(query.getFilter()).exec();
  
      return {
        items,
        total,
        page,
        limit,
      };
    }
  
    async paginateQuery(query, { page = this.DEFAULT_PAGE, limit = this.DEFAULT_LIMIT }) {
      const skip = limit * (page - 1);
      const paginatedQuery = query.skip(skip).limit(limit);
  
      const [items, total] = await Promise.all([
        paginatedQuery.exec(),
        this.model.countDocuments(query.getFilter()).exec(),
      ]);
  
      return {
        items,
        total,
        page,
        limit,
      };
    }
  
    async countQuery(query) {
      return await this.model.countDocuments(query.getFilter()).exec();
    }
  
    resolveNumericOption(value, defaultValue) {
      const resolvedValue = Number(value);
      if (Number.isInteger(resolvedValue) && resolvedValue >= 0) return resolvedValue;
      return defaultValue;
    }
  
    async useTransaction(transactionScopedFn) {
      const session = await this.model.startSession();
      let result;
  
      try {
        await session.withTransaction(async () => {
          result = await transactionScopedFn(session);
        });
      } catch (e) {
        throw new Error('Transaction failed');
      } finally {
        session.endSession();
      }
  
      return result;
    }
  }
  
  module.exports = {BaseRepository};
  