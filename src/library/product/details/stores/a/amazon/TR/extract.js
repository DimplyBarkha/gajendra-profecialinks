const { transform } = require('./format');
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
    try {
      const otherSellersDiv = 'div#mbc';
      await context.waitForSelector(otherSellersDiv, { timeout: 20000 });
      return await context.evaluate(function () {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }

        // @ts-ignore
        const firstCheck = document.querySelector('#buyboxTabularTruncate-1 > span.a-truncate-cut') ? document.querySelector('#buyboxTabularTruncate-1 > span.a-truncate-cut').innerText : '';
        const otherSellers = document.querySelectorAll('div.a-box.mbc-offer-row.pa_mbc_on_amazon_offer');
        // @ts-ignore
        const price = document.querySelector('span#price_inside_buybox') ? (document.querySelector('span#price_inside_buybox').innerText).replace(/₺(.*)/, '$1') : '';
        if (firstCheck && price) {
        // @ts-ignore
          if (firstCheck.innerText !== 'Amazon.com.tr' && otherSellers) {
            otherSellers.forEach((seller) => {
            // @ts-ignore
              const sellerPrice = seller.querySelector('span.a-color-price') ? seller.querySelector('span.a-color-price').innerText : '';
              const priceNum = sellerPrice.replace(/₺(.*)/, '$1');
              const shipsFrom = seller.querySelector('span.mbcMerchantName');
              const soldBy = seller.querySelector('span.mbcMerchantName');
              // @ts-ignore
              if (shipsFrom && shipsFrom.innerText === 'Amazon.com.tr' && soldBy && soldBy.innerText === 'Amazon.com.tr' && priceNum > price) {
                addHiddenDiv('ii_lbb', 'YES');
                addHiddenDiv('ii_lbbPrice', `₺${priceNum}`);
              }
            });
          }
        }
      });
    } catch (error) {
      console.log('no other sellers');
    }
    // }
  }

  await amazonHelp.setLocale('10001');

  await getLbb();
  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true);

  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'amazon',
    transform,
    domain: 'amazon.com.tr',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
