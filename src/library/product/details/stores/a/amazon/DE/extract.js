
const { transform } = require('../../../../sharedAmazon/transformNew');

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

  try {
    await context.waitForSelector('form#sp-cc', { timeout: 20000 });
    await context.evaluate(async function () {
      if (document.querySelector('input#sp-cc-accept')) {
        document.querySelector('input#sp-cc-accept').click();
      }
    });
  } catch (error) {
    console.log('No cookies pop-up.');
  }

  async function getLbb () {
    const elem = await helpers.checkXpathSelector('//div[contains(@id,"olpLinkWidget_feature_div")]');
    console.log('elem!@');
    console.log(elem);
    if (elem) {
      console.log('TESTING!!!');
      const allOfferClick = await context.evaluate(function () {
        return !!document.querySelector('#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a');
      });
      if (allOfferClick) {
        await helpers.checkAndClick('#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a', 'css', 20000);

        const otherSellersDiv = 'div#all-offers-display div#aod-offer div[id*="aod-price"]';

        try {
          await context.waitForSelector(otherSellersDiv, { timeout: 30000 });
        } catch (error) {
          await context.evaluate(function () {
            if (document.querySelector('#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a')) {
              document.querySelector('#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a').click();
            }
          });
          await context.waitForSelector(otherSellersDiv, { timeout: 20000 });
        }

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
                const priceNum = parseFloat(sellerPrice);
                const shipsFrom = seller.querySelector('div#aod-offer-shipsFrom div:nth-child(2) span');
                const soldBy = seller.querySelector('div#aod-offer-soldBy a:first-child') || seller.querySelector('div#aod-offer-soldBy div:nth-child(2) span');
                if (soldBy && soldBy.innerText.toLowerCase().includes('amazon.de') && priceNum > priceText) {
                  addHiddenDiv('ii_lbb', 'YES');
                  addHiddenDiv('ii_lbbPrice', `${sellerPrice}`);
                } else if (shipsFrom && soldBy) {
                  sellerNames.push(soldBy.innerText);
                  sellerPrices.push(priceNum);
                  sellerShipping.push(shipsFrom.innerText);
                  addHiddenDiv('pd_otherSellerName', soldBy.innerText);
                  addHiddenDiv('pd_otherSellersShipping2', shipsFrom.innerText);
                  addHiddenDiv('pd_otherSellersPrice', priceNum);
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
  }

  await getLbb();

  await amazonHelp.addEnhancedContent();
  await amazonHelp.addCurrentSellerInfo('Verkauf durch Amazon', /Verkauf durch (?:(.*) und |(.*).)/i);

  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true);

  const xpathPricePerUnit = '//*[@id="priceblock_ourprice"]//following-sibling::span|//*[@id="priceblock_saleprice"]//following-sibling::span';
  await helpers.getAndAddElem(xpathPricePerUnit, 'added-pricePerUnit', { property: 'innerText', callback: val => val });

  const variants = await amazonHelp.getVariants();

  if (variants && variants.length) {
    helpers.addItemToDocument('my-variants', variants.join(' | '));
  }
  await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    // transform: null,
    domain: 'amazon.de',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
