// path: ./src/api/restaurant/routes/01-custom-restaurant.js

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/recipes/:id/code",
      handler: "code.generatecode",
    },
    {
      method: "POST",
      path: "/recipes/:id/pay",
      handler: "code.pay",
    },
  ],
};
