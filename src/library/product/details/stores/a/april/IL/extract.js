const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'april',
    transform: cleanUp,
    domain: 'april.co.il',
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

      function stall(ms) {
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
      };

      const expectedSKU = getXpath("//meta[@property='og:url']/@content", 'nodeValue');
      if (expectedSKU && typeof expectedSKU === 'string') {
        addElementToDocument('sku', (expectedSKU.substring(29, 34)));
      }

      const avaiableText = getXpath("//div[@class='addToCart pull-right']//@disabled", 'nodeValue');
      if (avaiableText === 'disabled') {
        addElementToDocument('availableText', 'Out of Stock');
        console.log('out of');
      } else addElementToDocument('availableText', 'In Stock');

      const alternateBulletInfoXpath = "//div[@id='mytab_0']//ul//li";
      const alternateBulletInfoStr = getAllXpath(alternateBulletInfoXpath, 'innerText').join('||');
      if (alternateBulletInfoStr && typeof alternateBulletInfoStr === 'string') {
        addElementToDocument('bulletInfo', (alternateBulletInfoStr));
      }
      const variants = getAllXpath("//div[@class='colors']//button[@class='color_img']/@id", 'nodeValue').join('|');
      if (variants.length > 1) {
        addElementToDocument('variants', variants);
        addElementToDocument('firstVariant', expectedSKU.substring(29, 34));
      }
      var strVariant = variants.split('|');
      if (strVariant.length > 1) {
        const specifications = getAllXpath("//div[@id='mytab_0']", 'innerText').join('|');
        var specificationsText = specifications.split('.');
        addElementToDocument('variantcount', strVariant.length);
        addElementToDocument('specifications', specificationsText[5]);
      } else {
        const specifications = getXpath("//div[@id='mytab_0']//p[13]", 'innerText');
        addElementToDocument('variantcount', '0');
        addElementToDocument('specifications', specifications);
      }
      const variantId = getAllXpath("//div[@class='colors']//button[@class='color_img']/@id", 'nodeValue').join('|');
      if (variantId.length > 1) {
        // var str = variantId.split('|');
        // addElementToDocument('variantId', str[0]);
      } else {
        // const variantIdForSingle = getAllXpath("//div[@class='imgProduct']//img/@id", 'nodeValue');
        // addElementToDocument('variantId', variantIdForSingle);
      }

      const warranty = getAllXpath("//div[@id='mytab_0']", 'innerText').join('|');
      var strWarranty = warranty.split('|');
      if (strWarranty.length > 6) {
        addElementToDocument('warranty', strWarranty[12]);
        addElementToDocument('weightNet', strWarranty[1]);
      } else if (strWarranty.length > 1) {
        addElementToDocument('warranty', strWarranty[5].substring(30, 63));
      } else {
        const warrantyForOther = getAllXpath("//div[@id='mytab_0']//p[13]", 'innerText').join('|');
        if (warrantyForOther != null) {
          addElementToDocument('weightNet', warrantyForOther.substring(10, 23));
        } else {
          const warrantyForWithOut = getAllXpath("//div[@id='mytab_0']//p[4]", 'innerText').join('|');
          console.log('my warrantyForOther info ', warrantyForWithOut);
        }
      }

      const alternateCategoryXpath = "//div[@id='mytab_1']//ul//li";
      const alternateCategoryStr = getAllXpath(alternateCategoryXpath, 'innerText').join(',');
      if (alternateCategoryStr && typeof alternateCategoryStr === 'string') {
        const alternateCategoryList = alternateCategoryStr.split(',');
        var uniqueAlternateCategoryList = alternateCategoryList.filter(function (item, pos) {
          return alternateCategoryList.indexOf(item) === pos;
        });
        uniqueAlternateCategoryList.forEach(function (categoryData) {
          if (categoryData.match('קטגוריה') || categoryData.match('תת קטגוריה')) {
            console.log('categoryData', categoryData);
            addElementToDocument('category', (categoryData));
          }
          if (categoryData.match('מותג') && !categoryData.match('מותג בלועזית')) {
            console.log('brandData', categoryData);
            addElementToDocument('brandText', categoryData);
          }
          if (categoryData.match('גוון')) {
            console.log('variantData', categoryData);
            addElementToDocument('variantInformation', categoryData);
          }
          if (categoryData.match('ברקוד בינלאומי')) {
            console.log('variantData', categoryData);
            var gtin = categoryData.split(':');
            if (gtin.length > 1) {
              addElementToDocument('gtin', gtin[1]);
              addElementToDocument('variantId', gtin[1].substring(4));
            }
          }

          // ברקוד בינלאומי
        });
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
