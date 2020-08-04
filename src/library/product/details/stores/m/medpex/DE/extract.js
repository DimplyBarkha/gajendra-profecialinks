const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    transform,
    domain: 'medpex.de',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
      await context.waitForSelector('div#product-list > div.product-list-entry');
      async function firstItemLink () {
        return await context.evaluate(function () {
          // @ts-ignore
          const firstItem = document.querySelector('div#product-list > div.product-list-entry > form > div.clearfix > div.description > span.product-name > b > a').href;
          return firstItem;
        });
      }
      const url = await firstItemLink();
      if (url !== null) {
        await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
      }
      await context.evaluate(async function () {
        function addElementToDocument (key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }
      
        function findJsonObj (scriptSelector, startString, endString) {
          const xpath = `//script[contains(.,'${scriptSelector}')]`;
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          // @ts-ignore
          const scriptContent = element.innerText;
          const startIdx = scriptContent.indexOf(startString);
          const endIdx = scriptContent.indexOf(endString);
          let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
          jsonStr = jsonStr.trim();
          jsonStr = jsonStr.replace(/\\n/g, '\\n')
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, '\\&')
            .replace(/\\r/g, '\\r')
            .replace(/\\t/g, '\\t')
            .replace(/\\b/g, '\\b')
            .replace(/\\f/g, '\\f');
          // eslint-disable-next-line no-control-regex
          jsonStr = jsonStr.replace(/[\u0000-\u0019]+/g, '');
          return jsonStr;
        }
        // @ts-ignore
        let stockAvailabilityText = document.querySelector('link[itemprop="availability"]').href;
        stockAvailabilityText = stockAvailabilityText.split('/')[3];
        let rating = document.querySelector('div[class="review"] div');
        // @ts-ignore
        rating = rating ? rating.classList : '';
        // @ts-ignore
        rating = rating ? rating[2].split('-')[2] : '';
        const directions = document.querySelectorAll('div.content.content--productDescription > p');
        const siblingsDirections = [];
        for (let index = 0; index < directions.length; index++) {
          let element = directions[index];
          // @ts-ignore
          if (element.innerText === 'Anwendung:') {
            element = element.nextElementSibling;
            while (element) {
              if (element) {
                // @ts-ignore
                siblingsDirections.push(element.innerText);
                element = element.nextElementSibling;
              } else {
                break;
              }
            }
          }
        }
        // let secondaryImageTotal = document.querySelectorAll('div[id="more-images"] a img');
        // secondaryImageTotal = secondaryImageTotal ? secondaryImageTotal.length - 1 : '';
        let ecommerceObj = findJsonObj('EECproductDetailView', 'dataLayer.push(', ');');
        if (ecommerceObj) {
          ecommerceObj = JSON.parse(ecommerceObj.replace(/'/g, '"'));
          // addElementToDocument('pd_brandText', ecommerceObj.ecommerce.detail.products[0].brand);
          addElementToDocument('pd_variantId', ecommerceObj.ecommerce.detail.products[0].id);
          addElementToDocument('pd_packSize', (ecommerceObj.ecommerce.detail.products[0].variant).split(',')[1]);
          // addElementToDocument('pd_pageTimestamp', (new Date()).toISOString().replace(/[TZ]/g, ' '));
          // addElementToDocument('pd_nameExtended', ecommerceObj.ecommerce.detail.products[0].brand + ' _ ' + ecommerceObj.ecommerce.detail.products[0].name);
          addElementToDocument('pd_availabilityText', stockAvailabilityText);
          addElementToDocument('pd_aggregateRating', rating);
          // addElementToDocument('pd_secondaryImageTotal', secondaryImageTotal);
          addElementToDocument('pd_directions', siblingsDirections);
        }
      });
      // await context.extract(productDetails);
  return await context.extract(productDetails, { transform: parameters.transform });
}
