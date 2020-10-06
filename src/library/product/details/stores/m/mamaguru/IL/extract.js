
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'mamaguru',
    transform: null,
    domain: 'mamaguru.co.il',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
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
    });
    await context.extract(productDetails);
  },

};
