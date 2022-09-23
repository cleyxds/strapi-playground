"use strict";

const crypto = require("crypto");
const axios = require("axios");

/**
 * A set of functions called "actions" for `code`
 */

module.exports = {
  generatecode: async (ctx, next) => {
    try {
      const id = ctx.params?.id;

      const recipe = await strapi.db
        .query("api::recipe.recipe")
        .findOne({ where: { id } });

      const paymentIsProcessing = !!recipe.code && !recipe?.paid;
      const canGenerateCode = !recipe.code && !recipe?.paid;

      console.log({ isPaid: recipe.paid, paymentIsProcessing });

      if (paymentIsProcessing) {
        console.log("aguardando o pagamento");

        ctx.status = 202;
        return next();
      }

      if (!canGenerateCode) {
        ctx.status = 200;
        return next();
      }

      const { code } = await strapi.db.query("api::recipe.recipe").update({
        where: { id },
        data: {
          code: crypto.randomUUID().slice(0, 6).toUpperCase(),
        },
      });

      ctx.body = { code };
    } catch (err) {
      ctx.status = 400;
      ctx.body = { message: err.message };
    }
  },
  pay: async (ctx, next) => {
    const id = ctx.params?.id;

    try {
      await strapi.db.query("api::recipe.recipe").update({
        where: { id },
        data: {
          paid: true,
        },
      });

      const recipes = await strapi.db.query("api::recipe.recipe").findMany();

      ctx.status = 201;
      ctx.body = recipes;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { message: err.message };
    }
  },
};
