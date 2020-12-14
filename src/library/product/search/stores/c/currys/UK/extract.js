const { transform } = require('../../../../shared');

const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.click('span[data-name="ListView"]');
  await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
  const addSearchUrl = async function (context) {
    await context.evaluate(async function () {
      const productList = document.querySelectorAll(
        '.col12.resultList > article',
      );
      const url = window.location.href;
      productList.forEach((product) => product.setAttribute('searchurl', url));
    });
  };
  await addSearchUrl(context);

  await context.evaluate(() => {
    const article = document.querySelectorAll(
      'div[data-component="sponsored-products"] article',
    );
    console.log(`${article.length} sponsored products found`);
    article.forEach((el) => {
      el.setAttribute('sponsored', 'true');
    });
  });

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    transform,
    domain: 'currys.co.uk',
    zipcode: '',
  },
  implementation,
};
