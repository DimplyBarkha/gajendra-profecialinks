
const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  if (inputs.id) {
    await context.evaluate(async function () {
      const isSelector = document.querySelector('div.search-service-rsTilesDefault > div.search-service-product:first-child div.search-service-productDetailsWrapper a');
      if (isSelector) {
        try {
          isSelector.click();
        // await context.waitForNavigation({ timeout: 60000, waitUntil: 'load' });
        // await context.waitForNavigation({ timeout: 60000, waitUntil: 'load' });
        } catch (err) {
          console.log('Not clicked' + err);
        }
      }
    });
  }
  // if (inputs.id) {
  //   await context.evaluate(async function () {
  //     const isSelector = document.querySelector('div.search-service-rsTilesDefault > div.search-service-product:first-child div.search-service-productDetailsWrapper a');
  //     if (isSelector) {
  //       isSelector.click();
  //     }
  //   });
  // }
  await context.evaluate(async function () {
    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 60000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    optionalWait('h1.pdr-QuickInfo__heading');
    const gtinSelector = document.evaluate('//script[@type="application/ld+json"][contains(.,"gtin")]', document).iterateNext();
    if (gtinSelector) {
      const gtin = gtinSelector.textContent.split('gtin13":"')[1].split('",')[0];
      document.querySelector('h1.pdr-QuickInfo__heading').setAttribute('gtin', gtin);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'rewe',
    transform,
    domain: 'shop.rewe.de',
    zipcode: '',
  },
  implementation,
};
