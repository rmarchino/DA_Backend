const userRouter = require("./user.routes");
const serviceRouter = require("./service.routes");
const experienceRouter = require("./experience.routes");
const customerRouter = require("./customer.routes");
const customerPotencialRouter = require("./customerPotencial.routes");

const apiRoutes = (app) => {
  app.use(userRouter);
  app.use(serviceRouter);
  app.use(experienceRouter);
  app.use(customerRouter);
  app.use(customerPotencialRouter);
};

module.exports = apiRoutes;
