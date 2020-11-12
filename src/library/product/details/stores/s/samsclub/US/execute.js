
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 20000, waitUntil: 'load', checkBlocked: true });

    const productLink = await context.evaluate(function () {
      return document.querySelector("div.sc-plp-cards > div > ul > li > div > a").href;
    });

    if (productLink) {
      await context.goto(productLink, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    }
  },
};
