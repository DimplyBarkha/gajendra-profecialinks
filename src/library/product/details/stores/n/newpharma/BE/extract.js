
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'newpharma',
    transform: cleanUp,
    domain: 'newpharma.nl',
    zipcode: "''",
  },

  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      function appendData (data) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const name = `product-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
          addElementToDocument(name, data[key]);
        }
      }

      function getTextByXpath (xp) {
        return document.evaluate(xp, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
      }

      function searchDescription (description, header, nextHeader) {
        const re = new RegExp(`${header}(.+)${nextHeader}`);
        if (description.match(re)) return description.match(re)[1];
        return '';
      }

      function extractParagraph (header) {
        const description = getTextByXpath('(//div[contains(@class,"text-description-content")]/div)[1]');
        let nextHeader = getTextByXpath(`//*[contains(.,"${header}")]/following-sibling::strong[1]`);
        if (!nextHeader.match(/\w+/)) nextHeader = '';
        return searchDescription(description, header, nextHeader).replace(/\s:/g, '').trim();
      }

      const data = {};
      data.url = window.location.href;
      data.brandLink = document.querySelector('div.subtitle-brand > a')
        ? `https://www.newpharma.be${document.querySelector('div.subtitle-brand > a').getAttribute('href')}` : '';
      data.quantity = extractParagraph('Présentation');
      data.directions = extractParagraph('Conseils d’utilisation');
      data.warnings = extractParagraph('Précautions');
      data.ingredients = extractParagraph('Ingrédients');
      appendData(data);
    });
    await context.extract(productDetails, { transform });
  },
};
