async function setPagination(req, res, next) {
  const pageInQuery = Number.parseInt(req.query.page);
  const limitInQuery = Number.parseInt(req.query.limit);

  let page = 0;

  if (!Number.isNaN(pageInQuery) && pageInQuery > 0) {
    page = pageInQuery;
  }

  let limit = 20;

  if (
    !Number.isNaN(limitInQuery) &&
    !(limitInQuery > 20) &&
    !(limitInQuery < 1)
  ) {
    limit = limitInQuery;
  }

  req.limit = limit;
  req.page = page;

  next();
}
module.exports = {
  setPagination,
};
