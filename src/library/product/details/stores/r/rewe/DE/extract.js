
const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 60000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    // if (inputs.id) {
    //   const isSelector = document.querySelector('div.search-service-rsTilesDefault > div.search-service-product:first-child div.search-service-productDetailsWrapper picture');
    //   if (isSelector) {
    //     isSelector.click();
    //     // await context.waitForNavigation({ timeout: 60000, waitUntil: 'load' });
    //     optionalWait('h1.pdr-QuickInfo__heading');
    //   }
    // }
    optionalWait('h1.pdr-QuickInfo__heading');
    const gtinSelector = document.evaluate('//script[@type="application/ld+json"][contains(.,"gtin")]', document).iterateNext();
    if (gtinSelector) {
      let gtin = gtinSelector.textContent.split('gtin13":"')[1].split('",')[0];
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
