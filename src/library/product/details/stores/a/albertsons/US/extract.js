const { cleanUp } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'albertsons',
    transform: cleanUp,
    domain: 'albertsons.com',
    zipcode: '83642',
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
      const scriptElement1 = document.querySelectorAll('script[type="application/ld+json"]');
      // @ts-ignore
      const data = scriptElement1[1] && scriptElement1[1].innerText;
      const obj = data && JSON.parse(data);
      const avail = obj && obj.offers && obj.offers.availability;
      var appendElement = document.querySelector('picture[class*="img-responsive"]>img');
      if (avail) {
        appendElement.setAttribute('availability', 'In Stock');
      } else {
        appendElement.setAttribute('availability', 'Out Of Stock');
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
