const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // await context.evaluate(async () => {
  //   // add search url
  //   const searchUrl = window.location.href;
  //   const regex = /pageNumber=(\d+)/gm;
  //   const siteNumber = regex.exec(searchUrl);
  //   const productsSelector = 'ul[data-pagenumber="' + siteNumber[1] + '"]';

  //   var productsClass = document.querySelector(productsSelector);
  //   productsClass.setAttribute('target', 'toadd');
  // });

  await context.evaluate(async () => {
    await stall(3000);

    var isNextLinkPresent;
    var productsAmount;

    // scroll
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    var scrollTop = 0;
    do {
      scrollTop += 500;
      window.scroll(0, scrollTop);

      await stall(1000);
      isNextLinkPresent = document.querySelector('a[class="ak6cwf-16 ktouRL"]');
      productsAmount = document.querySelectorAll(
        'div[data-testid="product-block"]').length;
    } while (isNextLinkPresent && productsAmount < 100);
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
