const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    transform: transform,
    domain: 'booker.co.uk',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      const searchUrl = window.location.href;
      document.body.setAttribute('searchUrl', searchUrl);
    });

    return await context.extract(productDetails, { transform });
  },

};
