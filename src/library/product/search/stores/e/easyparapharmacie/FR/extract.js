const { transform } = require('../../../../shared');

const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    let buttonShowMore = document.querySelector('.ais-infinite-hits--showmore').children[0];
    if (buttonShowMore) {
      let counter = 0;
      const resultsPerPage = 24;
      const maxResultsForExtractor = 150 - resultsPerPage;
      do {
        if (Math.floor(maxResultsForExtractor / resultsPerPage) <= counter) {
          break;
        }
        buttonShowMore = document.querySelector('.ais-infinite-hits--showmore').children[0];
        buttonShowMore.click();
        await stall(500);
        counter++;
      }
      while (buttonShowMore.disabled == false);
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
    domain: 'easyparapharmacie.com',
    zipcode: '',
  },
  implementation,
};
