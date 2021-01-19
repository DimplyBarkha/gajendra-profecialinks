const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'dosfarma',
    transform: cleanUp,
    domain: 'dosfarma.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
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
      }; // En stock
      const price = getXpath("//p[@class='product-price']//span/text()", 'nodeValue');

      if (price != null) {
        addElementToDocument('price', '€' + price.slice(0, -1));
      }

      const availability = getXpath("(//div[@class='disponibilidad__mobile']//span[@class='no_disponible']//text())[1]", 'nodeValue');
      console.log('i am in my brand ', availability);
      if (availability === 'No disponible') {
        addElementToDocument('availabilityText', 'Out of Stock');
      } else addElementToDocument('availabilityText', 'In Stock');

      const size = getXpath("//div[@class='product__header dbtrustedshops']//h1//text()", 'nodeValue');
      console.log('i am in my brand ', size);
      if (size) {
        var NUMERIC_REGEXP = /[-]{0,1}[\d]*[.]{0,1}[\d]+/g;
        const sizeText = size.match(NUMERIC_REGEXP);
        console.log('i am in size', sizeText);
        if (sizeText != null) {
          addElementToDocument('quantity', sizeText + 'ml');
        }
      }
      const ratingCount = getXpath("//div[@class='reviews review-heading']//p[2]//span/text()", 'nodeValue');
      console.log('i am in my brand ', ratingCount);
      if (ratingCount) {
        var ratingCountVar = ratingCount + '';
        var ratingCountVarext = ratingCountVar.split(' ');
        addElementToDocument('ratingCount', ratingCountVarext[0]);
      }

      const warnings = getAllXpath("//div[@class='description']//*[contains(text(), 'Recomendación')]//ancestor::h3/following-sibling::p[position()<3] | //div[@id='collapse_descripcion']//*[contains(text(), 'Recomendación')]/ancestor::span//following-sibling::p[position()<3] | //div[@id='collapse_descripcion']//*[contains(text(), 'Recomendación ')]/ancestor::p//following-sibling::p[position()<3] | //div[@class='description']//*[contains(text(), 'Recomendación')]/ancestor::h2/following-sibling::p[position()<3]", 'innerText').join('');
      console.log('i am in my warnings ', warnings);
      if (warnings) {
        addElementToDocument('warnings', warnings);
      }

      const directions = getAllXpath("//div[@class='description']//*[contains(text(), 'Cómo')]/ancestor::h3/following-sibling::p[position()<2] | //div[@id='collapse_descripcion']//*[contains(text(), 'Cómo')]/ancestor::span//following-sibling::p[position()<2] | //div[@id='collapse_descripcion']//*[contains(text(), 'Cómo')]/ancestor::p//following-sibling::p[position()<2]", 'innerText');
      console.log('i am in my warnings ', directions);
      if (directions) {
        addElementToDocument('directions', directions);
      }

      const descrption1 = getAllXpath("//div[contains(@class, 'product__shortdesc')]", 'innerText').join('');
      const descrption2 = getAllXpath("//div[contains(@id, 'descripcion')]//div[contains(@class, 'description')]//h2", 'innerText').join('');
      const descrption3 = getAllXpath("//div[contains(@id, 'descripcion')]//div[contains(@class, 'description')]//span[@style='font-size: 12pt;']", 'innerText').join('');
      const descrption4 = getAllXpath(" //div[contains(@id, 'descripcion')]//div[contains(@class, 'description')]//ancestor::h2/following-sibling::p[position()<3]", 'innerText').join('');
      var res = descrption1.concat(descrption2, descrption3, descrption4);
      console.log('i am in my res ', res);
      if (directions) {
        addElementToDocument('description', res);
      }

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
