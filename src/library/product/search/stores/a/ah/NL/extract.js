const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'ah',
    transform,
    domain: 'ah.nl',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    await context.evaluate(() => {
      const cookies = document.querySelector('button[id="accept-cookies"]');
      if (cookies) {
        cookies.click();
      }
      const searchUrl = window.location.href;
      // @ts-ignore
      const appendElements = [...document.querySelectorAll('article[data-testhook="product-card"]')];
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('search-url', searchUrl);
        });
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
