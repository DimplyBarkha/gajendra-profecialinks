const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'mamaguru',
    transform: cleanUp,
    domain: 'mamaguru.co.il',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const tabContent = getXpath("//div[@class='TabContent']", 'innerText');

      if (tabContent) {
        if (tabContent.includes('משקל')) {
          const weightSubstring = tabContent.substring(tabContent.indexOf('משקל'), tabContent.indexOf('\n', tabContent.indexOf('משקל')));
          addElementToDocument('added_weight', (weightSubstring.split(/[-:]+/))[1]);
        }

        if (tabContent.includes('מידות')) {
          const shippingDimensions = tabContent.substring(tabContent.indexOf('מידות'), tabContent.indexOf('\n', tabContent.indexOf('מידות')));
          addElementToDocument('added_shipping_dimensions', (shippingDimensions.split(/[-:]+/))[1]);
        }

        if (tabContent.includes('צבע')) {
          const color = tabContent.substring(tabContent.indexOf('צבע'), tabContent.indexOf('\n', tabContent.indexOf('צבע')));
          addElementToDocument('added_color', (color.split(/[-:]+/))[1]);
        }
      }

      const specificationText = getXpath("//div[@class='TabContent']//p//strong[contains(text(), 'מפרט טכני')]/following::ul", 'innerText');
      if (specificationText) {
        addElementToDocument('added_specifications', specificationText.split('\n').join(' || '));
      }

      // get the json object
      const jsonStr = getXpath("//script[@type='application/ld+json']/text()", 'nodeValue');
      if (jsonStr) {
        const jsonObj = JSON.parse(jsonStr);
        addElementToDocument('added_mpn', jsonObj.mpn);
        if (jsonObj.aggregateRating) {
          addElementToDocument('added_aggregate_rating', jsonObj.aggregateRating.ratingValue);
        }
      }

      const warrantyText = getXpath("//div[@class='R WarrantyText']/p", 'innerText');
      if (warrantyText) {
        const warrantySubtext = warrantyText.split(' ');
        warrantySubtext.forEach(text => {
          if (text.includes('שנת')) {
            addElementToDocument('added_warranty', text);
          }
        });
      }
      const technicalInformationPdfPresent = getXpath("(//a[contains(concat(' ',normalize-space(@href),' '),'.pdf')])[1]", 'innerText');
      if (technicalInformationPdfPresent) {
        addElementToDocument('added_technical_information_pdf_present', 'Yes');
      }

      const priceValue = getXpath("//div[@class='PriceWrap R']//div[contains(@class, 'Price ')]//span[@id='mpr']/text()", 'nodeValue');
      const priceCurrency = getXpath("//div[@class='PriceWrap R']//div[contains(@class, 'Price ')]//small/text()", 'nodeValue');
      if (priceValue && priceCurrency) {
        addElementToDocument('added_price', priceCurrency + ' ' + priceValue);
      }

      const listPriceValue = getXpath("//div[@class='SalePrice']//span[@id='rpr']/text()", 'nodeValue');
      const listPriceCurrency = getXpath("//div[@class='SalePrice']//small/text()", 'nodeValue');
      if (listPriceValue && listPriceCurrency) {
        addElementToDocument('added_list_price', listPriceCurrency + ' ' + listPriceValue);
      }

      const descriptionText = getAllXpath("((//div[@class='TabContent'])[1]//p) | ((//div[@class='TabContent'])[1]//ul/li)", 'innerText').join(',');
      if (descriptionText) {
        addElementToDocument('added_description', descriptionText);
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },

};
