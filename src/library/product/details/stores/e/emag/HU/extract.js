const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await context.evaluate(async () => {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    const moreInfoButton = document.querySelector('a[data-ph-target="#description-body"]');

    if (moreInfoButton !== null) {
      moreInfoButton.click();
    }

    let scrollTop = 0;
    while (scrollTop !== 15000) {
      await stall(100);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 15000) {
        await stall(100);
        break;
      }
    }
  });

  await context.evaluate(() => {
    const url = window.location.href;
    let sku = url.match('pd/(.*?/)');
    sku = sku[1].replace('/', '');
    const brandLink = document.querySelector('div.disclaimer-section>p>a');

    brandLink.setAttribute('sku', String(sku));
    brandLink.setAttribute('brandlink', brandLink.href);
    brandLink.setAttribute('url', url);
  });

  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'HU',
    store: 'emag',
    transform: cleanUp,
    domain: 'emag.hu',
    zipcode: '',
  },
  implementation,
};
