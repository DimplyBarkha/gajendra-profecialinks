const { transform } = require('../../../../shared');
const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForSelector('.product-cardstyles__Container-sc-1uwpde0-1.eaVrql');
  async function firstItemLink() {
    return await context.evaluate(function () {
      const firstItem = document.querySelector('.product-cardstyles__Container-sc-1uwpde0-1.eaVrql > a').href;
      return firstItem;
    });
  }
  const url = await firstItemLink();
  if (url !== null) {
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  }
  // getting price and listPrice
  await context.evaluate(async function () {
    const saleElement = document.querySelector('div.buy-boxstyles__BuyBox-sc-16stmqn-0.gqXNEz div.seal-sale-box-divided__Value-pf7r6x-3.bgtGEw');
    const element = document.querySelector('.buy-box-contentstyles__BuyBoxContent-sc-18rwav0-0.kQzpcj');
    if (saleElement) {
      const price = document.evaluate('//div[@class="buy-box-contentstyles__Container-sc-18rwav0-2 grwTtk"]//div[@class="seal-sale-box-divided__Value-pf7r6x-3 bgtGEw"]//text()', document, null, XPathResult.STRING_TYPE, null).stringValue;
      element.setAttribute('price', price);
      const listPrice = document.evaluate('//div[@class="buy-box-contentstyles__Container-sc-18rwav0-2 grwTtk"]//div[@class="current-pricesectionstyles__CurrentPrice-sc-17j9p6i-0 drikI"]//text()', document, null, XPathResult.STRING_TYPE, null).stringValue;
      element.setAttribute('listPrice', listPrice);
    } else {
      const price = document.evaluate('//div[@class="buy-box-contentstyles__Container-sc-18rwav0-2 grwTtk"]//div[@class="current-pricesectionstyles__CurrentPrice-sc-17j9p6i-0 drikI"]//text()', document, null, XPathResult.STRING_TYPE, null).stringValue;
      element.setAttribute('price', price);
    }
  });
  return await context.extract(productDetails, { transform });
};
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'paodeacucar',
    transform: transform,
    domain: 'paodeacucar.com',
    zipcode: '',
  },
  implementation,
};
