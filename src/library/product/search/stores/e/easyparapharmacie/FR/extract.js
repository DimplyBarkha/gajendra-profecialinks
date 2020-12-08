const { transform } = require('../../../../shared');

const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate( async () => {
    const buttonShowMore = document.querySelector('.ais-infinite-hits--showmore').children[0];
    if (buttonShowMore !== null ) {
      buttonShowMore.click();
    }
    else return
  })

  const addSearchUrl = async function (context) {
    await context.evaluate(async () => {
      const productList = document.querySelectorAll(
        '.products-list div[class="products small-product"]',
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
    country: 'FR',
    store: 'easyparapharmacie',
    transform,
    domain: 'www.easyparapharmacie.com',
    zipcode: '',
  },
  implementation
};
