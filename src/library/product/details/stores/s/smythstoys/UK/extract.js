module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'smythstoys',
    transform: null,
    domain: 'smythstoys.com',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const popUps = document.querySelector('div.col-xs-12 > button').click();
      if (popUps) popUps.click();
    });
    await context.extract(productDetails);
  },
};

