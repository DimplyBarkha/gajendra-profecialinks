
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  let resultArr = [];
  let dataResults = [];

  function stall(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms)
    });
  }

  while(true) {
    await context.waitForXPath('//div[@class="product-item__details"]');
    await stall(5000);
    const hasNextButton = await context.evaluate(function() {
      return document.querySelector('.pagination__item--next') && document.querySelector('.pagination__item--next').querySelector('a');
    });
    resultArr = await context.evaluate(function(resultArr) {
      document.querySelectorAll('.product-item__details').forEach(el => {
        if (resultArr.length >= 150) {
          el.remove();
        }
        resultArr.push(true);
      });
      return resultArr;
    }, resultArr);

    console.log('totalResults', resultArr.length);

    const results = context.extract(productDetails, { transform });
    dataResults.push(results);
    await stall(2000);

    if (hasNextButton && resultArr.length < 150) {
      await context.evaluate(function() {
        document.querySelector('.pagination__item--next').querySelector('a').click();
      });
    } else {
      break;
    }
  }

  return dataResults;

}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'euronics',
    transform: null,
    domain: 'euronics.co.uk',
  },
  implementation,
};
