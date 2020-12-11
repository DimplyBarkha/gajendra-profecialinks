const { transform } = require('../../../../shared');
const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // getting price and listPrice
  await context.evaluate(async function () {
    const saleElement = document.querySelector('div.buy-boxstyles__BuyBox-sc-16stmqn-0.gqXNEz div.seal-sale-box-divided__Value-pf7r6x-3.bgtGEw');
    const element = document.querySelector('.MuiGrid-root.gridstyles-sc-6scn59-0.bTtDHr');
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
