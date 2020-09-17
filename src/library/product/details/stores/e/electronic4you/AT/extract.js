
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
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.click('li#tab-description a');
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
      const manufacturerDesc = document.querySelector('div#flix-dyson-new-inpage')
        // @ts-ignore
        ? document.querySelector('div#flix-dyson-new-inpage').innerText : '';
      if (manufacturerDesc) {
        addElementToDocument('desc_manufacturer', manufacturerDesc.replace(/•/g, '||').replace(/\n|\s{2,}|-{1,}/g, ' '));
      }
      const manufacturerDesc1 = document.querySelector('div.features-list-product-page')
        // @ts-ignore
        ? document.querySelector('div.features-list-product-page').innerText : '';
      if (manufacturerDesc1) {
        addElementToDocument('desc_manufacturer1', manufacturerDesc1.replace(/•/g, '||').replace(/\n|\s{2,}/g, ' '));
      }
      const manufacturerDesc2 = document.querySelector('div.dyson-content')
        // @ts-ignore
        ? document.querySelector('div.dyson-content').innerText : '';
      if (manufacturerDesc2) {
        addElementToDocument('desc_manufacturer2', manufacturerDesc2.replace(/•/g, '||').replace(/\n|\s{2,}/g, ' '));
      }
      const desc3Xpath = document.evaluate("//h3[contains(text(),'Details')]/following-sibling::div[contains(@class,'std')]/p[1]", document, null, XPathResult.STRING_TYPE, null);
      const desc3 = desc3Xpath ? desc3Xpath.stringValue : '';
      if (desc3) {
        addElementToDocument('desc_manufacturer3', desc3.replace(/•/g, '||').replace(/\s{2,}|\n/g, ' '));
      }
      const desc4Xpath = document.evaluate("//h3[contains(text(),'Details')]/following-sibling::div[contains(@class,'std')]/ul", document, null, XPathResult.STRING_TYPE, null);
      const desc4 = desc4Xpath ? desc4Xpath.stringValue : '';
      if (desc4) {
        addElementToDocument('desc_manufacturer4', desc4.replace(/•/g, '||').replace(/\s{2,}|\n/g, ' '));
      }
      const desc5Xpath = document.evaluate("//h3[contains(text(),'Details')]/following-sibling::div[contains(@class,'std')]/div", document, null, XPathResult.ANY_TYPE, null);
      // eslint-disable-next-line prefer-const
      if (desc5Xpath) {
        let parts = [];
        for (let part = desc5Xpath.iterateNext(); part; part = desc5Xpath.iterateNext()) {
          parts.push(part.innerText);
        }
        const desc5 = parts.join(', ');
        addElementToDocument('desc_manufacturer5', desc5.replace(/•/g, '||').replace(/\s{2,}|\n/g, ' '));
      }
      const warrantyXpath = document.evaluate("//h3[contains(text(), 'arantie')]/..", document, null, XPathResult.STRING_TYPE, null);
      const warranty = warrantyXpath ? warrantyXpath.stringValue : '';
      if (warranty) {
        addElementToDocument('warranty', warranty.replace(/•/g, '||').replace(/\s{2,}|\n/g, ' '));
      }
      const dimensions = document.evaluate("//th[contains(text(),'Breite') or contains(text(),'Höhe') or contains(text(),'Tiefe')]/following-sibling::td", document, null, XPathResult.ANY_TYPE, null);
      // eslint-disable-next-line prefer-const
      if (dimensions) {
        let nodes = [];
        for (let node = dimensions.iterateNext(); node; node = dimensions.iterateNext()) {
          nodes.push(node.innerText);
        }
        const specifications = nodes.join(' x ');
        addElementToDocument('specifications', specifications);
      }
      const pdfPresent = document.querySelector('a[title="Produktdatenblatt anzeigen"]')
        // @ts-ignore
        ? document.querySelector('a[title="Produktdatenblatt anzeigen"]').getAttribute('href') : '';
      if (pdfPresent) {
        addElementToDocument('pdfPresent', 'Yes');
      } else addElementToDocument('pdfPresent', 'No');
    });
    await context.extract(productDetails);
  },
};
