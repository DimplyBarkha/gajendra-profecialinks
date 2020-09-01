
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'electronic4you',
    transform: cleanUp,
    domain: 'electronic4you.at',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const descBullets = document.querySelector('div.short-description ul')
        // @ts-ignore
        ? document.querySelector('div.short-description ul').innerText : '';
      if (descBullets) {
        addElementToDocument('desc_bullets', descBullets.replace(/\n|•/g, '').replace(/\s{2,}/g, ' '));
      }
      const techDetails = document.querySelector('table#product-attribute-specs-table tbody')
        // @ts-ignore
        ? document.querySelector('table#product-attribute-specs-table tbody').innerText : '';
      if (techDetails) {
        addElementToDocument('desc_techDetails', techDetails.replace(/\n|•/g, '').replace(/\s{2,}/g, ' '));
      }
      const manufacturerDesc1 = document.querySelector('div.features-list-product-page')
        // @ts-ignore
        ? document.querySelector('div.features-list-product-page').innerText : '';
      if (manufacturerDesc1) {
        addElementToDocument('desc_manufacturer1', manufacturerDesc1.replace(/\n|•/g, '').replace(/\s{2,}/g, ' '));
      }
      const manufacturerDesc2 = document.querySelector('div.dyson-content')
        // @ts-ignore
        ? document.querySelector('div.dyson-content').innerText : '';
      if (manufacturerDesc2) {
        addElementToDocument('desc_manufacturer2', manufacturerDesc2.replace(/\n|•/g, '').replace(/\s{2,}/g, ' '));
      }
      const warrantyXpath = document.evaluate("//h3[contains(text(), 'arantie')]/..",document, null, XPathResult.STRING_TYPE, null);
      const warranty = warrantyXpath ? warrantyXpath.stringValue : '';
      if (warranty) {
        addElementToDocument('warranty', warranty.replace(/•/g, '-').replace(/\s{2,}|\n/g, ' '));
      }
      const pdfPresent = document.querySelector('a[title="Produktdatenblatt anzeigen"]')
        // @ts-ignore
        ? document.querySelector('a[title="Produktdatenblatt anzeigen"]').getAttribute('href') : '';
      if (pdfPresent) {
        addElementToDocument('pdfPresent', true);
      } else addElementToDocument('pdfPresent', false);
    });
    await context.extract(productDetails);
  },
};
