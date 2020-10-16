
// const { transform } = require('../../../../sharedAmazon/transformNew');
const { transform } = require('./transform');
// const { implementation } = require('../otherSellersHelper');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails, Helpers: { Helpers }, AmazonHelp: { AmazonHelp } } = dependencies;

  const helpers = new Helpers(context);
  const amazonHelp = new AmazonHelp(context, helpers);

  async function getLbb () {
    const elem = await helpers.checkXpathSelector('//div[contains(@id,"olpLinkWidget_feature_div")]');
    console.log('elem!@');
    console.log(elem);
    if (elem) {
      console.log('TESTING!!!');
      await helpers.checkAndClick('#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a', 'css', 20000);

      const otherSellersDiv = 'div#all-offers-display div#aod-offer div[id*="aod-price"]';
      await context.waitForSelector(otherSellersDiv, { timeout: 20000 });

      return await context.evaluate(function () {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }

        const firstCheck = document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div');
        const otherSellers = document.querySelectorAll('div#aod-offer');
        const price = document.querySelector('span#price_inside_buybox');
        if (firstCheck && price) {
          const priceText = parseFloat((price.innerText).slice(1));
          if (firstCheck.innerText !== 'Ships from and sold by Amazon.com.' && otherSellers) {
            const sellerNames = [];
            const sellerPrices = [];
            const sellerShipping = [];

            otherSellers.forEach((seller) => {
              const sellerPrice = seller.querySelector('span.a-offscreen') ? seller.querySelector('span.a-offscreen').innerText : '';
              // const priceNum = parseFloat(sellerPrice.slice(1));
              const shipsFrom = seller.querySelector('div#aod-offer-shipsFrom div:nth-child(2) span');
              const soldBy = seller.querySelector('div#aod-offer-soldBy a:first-child') || seller.querySelector('div#aod-offer-soldBy div:nth-child(2) span');
              if (sellerNames.toLowerCase().includes('amazon.de') && priceNum > priceText) {
                addHiddenDiv('ii_lbb', 'YES');
                addHiddenDiv('ii_lbbPrice', `${sellerPrice}`);
              } else if (shipsFrom && soldBy) {
                sellerNames.push(soldBy.innerText);
                sellerPrices.push(sellerPrice);
                sellerShipping.push(shipsFrom.innerText);
                addHiddenDiv('pd_otherSellerName', soldBy.innerText);
                addHiddenDiv('pd_otherSellersShipping2', shipsFrom.innerText);
                addHiddenDiv('pd_otherSellersPrice', sellerPrice);
              }
            });
            // addHiddenDiv('pd_otherSellerName', sellerNames.join(' | '));
            // addHiddenDiv('pd_otherSellersShipping2', sellerShipping.join(' | '));
            // addHiddenDiv('pd_otherSellersPrice', sellerPrices.join(' | '));
          }
        }
      });
    }
  }

  await getLbb();

  await amazonHelp.addEnhancedContent();
  await amazonHelp.addCurrentSellerInfo('Verkauf durch Amazon', /Verkauf durch (?:(.*) und |(.*).)/i);

  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    domain: 'amazon.de',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
