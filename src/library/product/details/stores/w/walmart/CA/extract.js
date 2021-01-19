const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    transform,
    domain: 'walmart.ca',
    zipcode: '',
  },
  dependencies: {
    goto: 'action:navigation/goto',
    createUrl: 'action:product/details/createUrl',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    helperModule: 'module:helpers/helpers',
  },
  // @ts-ignore
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, dependencies) => {
    const { helperModule: { Helpers } } = dependencies;
    const helper = new Helpers(context);
    // scroll to bottom of page
    await context.evaluate(async () => {
      await window.scrollTo(0, document.body.scrollHeight);
    });
    // scroll to iframe
    await context.evaluate((selector) => {
      const updp = document.querySelector(selector);
      if (updp) updp.scrollIntoView();
    }, 'div[data-automation="RichRelevanceCarousel"]');
    return await context.extract(dependencies.productDetails, { transform: transformParam });
  },
};
