
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
      const topBullets = document.querySelectorAll('div.short-description ul li')
        ? document.querySelectorAll('div.short-description ul li') : [];
      const topDivs = document.querySelectorAll('div.short-description div[itemprop="description"] div')
        ? document.querySelectorAll('div.short-description div[itemprop="description"] div') : [];
      const nodes = topBullets.length ? topBullets : topDivs;
      if (nodes) {
        const bulletsArr = [];
        nodes.forEach(e => bulletsArr.push(e.innerText));
        const concatTopBullets = bulletsArr.join(' || ');
        addElementToDocument('top_bullets', concatTopBullets.replace(/\s{2,}/g, ' '));
      }
      const descBulletsXpath = document.evaluate("//h3[contains(text(),'Details')]/following-sibling::div[contains(@class,'std')]/ul/li", document, null, XPathResult.ANY_TYPE, null);
      // eslint-disable-next-line prefer-const
      if (descBulletsXpath) {
        let bullets = [];
        for (let bullet = descBulletsXpath.iterateNext(); bullet; bullet = descBulletsXpath.iterateNext()) {
          bullets.push(bullet.innerText);
        }
        const concatDescBullets = bullets.join(' || ');
        addElementToDocument('concatDescBullets', concatDescBullets.replace(/\s{2,}|\n/g, ' '));
      }
      const desc1Xpath = document.evaluate("//h3[contains(text(),'Details')]/following-sibling::div[contains(@class,'std')]/p[1]", document, null, XPathResult.STRING_TYPE, null);
      const desc1 = desc1Xpath ? desc1Xpath.stringValue : '';
      if (desc1) {
        addElementToDocument('desc_part1', desc1.replace(/•/g, '||').replace(/\s{2,}|\n/g, ' '));
      }
      const desc2Xpath = document.evaluate("//h3[contains(text(),'Details')]/following-sibling::div[contains(@class,'std')]/div", document, null, XPathResult.ANY_TYPE, null);
      // eslint-disable-next-line prefer-const
      if (desc2Xpath) {
        let parts = [];
        for (let part = desc2Xpath.iterateNext(); part; part = desc2Xpath.iterateNext()) {
          parts.push(part.innerText);
        }
        const desc2 = parts.join(', ');
        addElementToDocument('desc_part2', desc2.replace(/•/g, '||').replace(/\s{2,}|\n/g, ' '));
      }
      const techDetails = document.querySelector('table#product-attribute-specs-table tbody')
        // @ts-ignore
        ? document.querySelector('table#product-attribute-specs-table tbody').innerText : '';
      if (techDetails) {
        addElementToDocument('desc_techDetails', techDetails.replace(/\n|•/g, '').replace(/\s{2,}/g, ' '));
      }
      const manufacturerDesc = document.querySelector('div#flix-std-inpage')
        // @ts-ignore
        ? document.querySelector('div#flix-std-inpage').innerText : '';
      if (manufacturerDesc) {
        addElementToDocument('desc_manufacturer', manufacturerDesc.replace(/•/g, '||').replace(/\n|\s{2,}|-{1,}/g, ' '));
      }
      const manufacturerDesc1 = document.querySelector('div.dyson-content')
        // @ts-ignore
        ? document.querySelector('div.dyson-content').innerText : '';
      if (manufacturerDesc1) {
        addElementToDocument('desc_manufacturer1', manufacturerDesc1.replace(/•/g, '||').replace(/\n|\s{2,}/g, ' '));
      }
      const manufacturerDesc2 = document.querySelector('div.features-list-product-page')
        // @ts-ignore
        ? document.querySelector('div.features-list-product-page').innerText : '';
      if (manufacturerDesc2) {
        addElementToDocument('desc_part3', manufacturerDesc2.replace(/•/g, '||').replace(/\n|\s{2,}/g, ' '));
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
