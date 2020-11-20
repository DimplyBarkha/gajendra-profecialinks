const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // wait few seconds to load popup
  await context.evaluate(async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  });

  // accept policy
  try {
    await context.click('div[class="v8o5b9-9 ifwxYc"] button');
  } catch (exp) {
    console.log('Click accept button error' + exp);
  }

  // variant with nextlink page selector == null

  await context.evaluate(async () => {
    // add search url
    const searchUrl = window.location.href;
    const regex = /pageNumber=(\d+)/gm;
    const siteNumber = regex.exec(searchUrl);
    const productsSelector = 'ul[data-pagenumber="' + siteNumber[1] + '"]';

    var productsClass = document.querySelector(productsSelector);
    productsClass.setAttribute('target', 'toadd');

    const prefix = 'https://www.maxi.rs/';
    const products = document.querySelectorAll(
      'a[data-testid="product-block-image-link"]');
    products.forEach((product, index) => {
      // set product url
      const productUrl = product.getAttribute('href');
      product.setAttribute('product_url', prefix + productUrl);
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RS',
    store: 'maxi',
    transform: transform,
    domain: 'maxi.rs',
    zipcode: '',
  },
  implementation,
};
