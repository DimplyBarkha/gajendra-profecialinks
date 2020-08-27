const { transform } = require('../transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'group-digital',
    transform,
    domain: 'group-digital.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      await new Promise(resolve => setTimeout(resolve, 2814));
      const element = document.querySelector('div[class="footer-bottom-links"]');
      let countOfTry = 0;
      if (element) {
        while (!document.querySelector('div[class="ias-noneleft"] em')) {
          element.scrollIntoView({ behavior: 'smooth' });
          await new Promise(resolve => setTimeout(resolve, 3000));
          countOfTry++;
          if (countOfTry > 40) {
            break;
          }
          const productsCount = document.querySelectorAll('div[class="category-products"] > ul > li');
          if (productsCount && productsCount.length > 150) {
            break;
          }
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
