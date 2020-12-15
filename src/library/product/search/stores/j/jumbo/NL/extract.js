const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // do {
  await context.evaluate(async () => {
    function addProp (iterator, name, value) {
      document.querySelectorAll('div[analytics-tag="product card"]')[iterator].setAttribute(name, value);
    }

    const productUrlAll = document.querySelectorAll('.list-methods a.opposite');
    let productUrl;
    const priceArray = [];
    let price;
    const priceSelector = document.querySelectorAll('span.jum-product-price__current-price.d-inline-flex.align-items-start');
    for (let i = 0; i < priceSelector.length; i++) {
      price = priceSelector[i].textContent;

      productUrl = productUrlAll[i].href;

      priceArray[0] = price.match('..$');
      priceArray[1] = price.replace(priceArray[0], '');
      price = priceArray[1] + ',' + priceArray[0];

      addProp(i, 'productUrl', productUrl);
      addProp(i, 'price', price);
      addProp(i, 'rank', `${i + 1}`);
    }

    let searchUrl;

    if (priceSelector.length === 0) {
      searchUrl = null;
    } else {
      searchUrl = window.location.href;
    }
    document.querySelector('body').setAttribute('searchurl', searchUrl);
  });

  //   await context.extract(productDetails, { transform });

  //   await new Promise((resolve) => setTimeout(resolve, 3000));

  //   await context.evaluate(() => {
  //     document.querySelector('span.d-xs-inline.d-l-none').click();
  //   });
  // } while (await context.evaluate(() => {
  //   return document.querySelector('span.d-xs-inline.d-l-none');
  // }) !== null);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    transform,
    domain: 'jumbo.com',
    zipcode: '',
  },
  implementation,
};
