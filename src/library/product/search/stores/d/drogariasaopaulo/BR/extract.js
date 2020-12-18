const { transform } = require('../../../../shared');
const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    let moreItems = document.querySelector('div[class*="text-center btn-load-more"] button[class*="btn btn-primary"]');
    if (moreItems) {
      do {
        moreItems.click();
        await stall(5000);
        moreItems = document.querySelector('div[class*="text-center btn-load-more"] button[class*="btn btn-primary"]');
      }
      while (moreItems !== null);
    }

    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });

  const addSearchUrl = async function (context) {
    await context.evaluate(async function () {
      const productList = document.querySelectorAll(
        '.vitrine.resultItemsWrapper > li',
      );
      const url = window.location.href;
      productList.forEach((product) => product.setAttribute('searchurl', url));
    });
  };
  await addSearchUrl(context);
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'drogariasaopaulo',
    transform: transform,
    domain: 'drogariasaopaulo.com',
    zipcode: '',
  },
  implementation,
};
