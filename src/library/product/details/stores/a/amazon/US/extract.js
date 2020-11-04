const { transform } = require('../../../../sharedAmazon/transformNew');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails, Helpers: { Helpers } } = dependencies;

  const helpers = new Helpers(context);

  async function getLbb () {
    const elem = await helpers.checkXpathSelector("//div[contains(@id, 'glow-toaster-body') and //*[contains(text(), 'Amazon Fresh')]]/following-sibling::div[@class='glow-toaster-footer']//input[@data-action-type='SELECT_LOCATION']");
    if (elem) {
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
            otherSellers.forEach((seller) => {
              const sellerPrice = seller.querySelector('span.a-offscreen') ? seller.querySelector('span.a-offscreen').innerText : '';
              const priceNum = parseFloat(sellerPrice.slice(1));
              const shipsFrom = seller.querySelector('div#aod-offer-shipsFrom div.a-column.a-span9.a-span-last');
              const soldBy = seller.querySelector('div#aod-offer-soldBy div.a-column.a-span9.a-span-last');
              if (shipsFrom && shipsFrom.innerText === 'Amazon.com' && soldBy && soldBy.innerText === 'Amazon.com' && priceNum > priceText) {
                addHiddenDiv('ii_lbb', 'YES');
                addHiddenDiv('ii_lbbPrice', `${priceNum}`);
              }
            });
          }
        }
      });
    }
  }

  async function pageData () {
    return await context.evaluate( async() => {
      let pageContext = {}
      //get variants
        pageContext["variants"] = !!window.isTwisterPage ? [...new Set(Object.keys(window.twisterController.initTwisterState.twisterVariationsData.dimensionValuesDisplay))] : null
      //get parentAsin
        pageContext["parentAsin"] = !!window.isTwisterPage ? window.twisterController.twisterJSInitData.parent_asin : null
      //get currentAsin
        pageContext["currentAsin"] = !!window.isTwisterPage ? window.twisterController.twisterJSInitData.current_asin : window.ue_pti
      //check for additionalRatings
        pageContext["additionalRatings"] = !!document.querySelector('table#histogramTable')
      
        return pageContext
    });
  }

  async function pageManipulation (page) {
    if(page.additionalRatings){
      await context.evaluate(async (page) => {
          document.querySelector('table#histogramTable').scrollIntoView()
      }, page);
      await context.waitForXPath('//div[@data-hook="cr-summarization-attributes-list"]//span[contains(@class,"a-size-base")]', { timeout: 5000 })
          .catch(() => console.log('no additional ratings'));
    }
  }

  let pageContext = await pageData()
  console.log("pageContext", pageContext)
  await helpers.addItemToDocument('my-variants', pageContext.variants)
  await helpers.addItemToDocument('my-parent-asin', pageContext.parentAsin)
  await helpers.addItemToDocument('my-current-asin', pageContext.currentAsin)
  await getLbb();
  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true)

  await pageManipulation(pageContext)

  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    transform,
    domain: 'amazon.com',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
  },
  implementation,
};
