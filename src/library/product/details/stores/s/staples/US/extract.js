// @ts-nocheck
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'staples',
    transform: transform,
    domain: 'staples.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const productUrl = await context.evaluate(async function () {
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const url = getXpath('//div[@class="productView__productTileRows"]//a[@class="standard-type__product_title"]/@href', 'nodeValue');
      return url;
    });
    console.log(productUrl);
    if (productUrl != null) {
      await context.goto('https://www.staples.com' + productUrl, { timeout: 100000, waitUntil: 'load', checkBlocked: true });
    }
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
      };

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }

      let image = getXpath("//div[@class='carousel__slider_content']//img/@srcset", 'nodeValue');
      if (image != null && image.includes('?')) {
        image = image.split('?')[0];
      }
      addElementToDocument('added_image', image);

      const description = getAllXpath("//div[@id='Details']//div[@id='detail_container']/div/text() | //div[@id='Details']//div[@id='detail_container']/p/text() | //div[@id='Details']//div[@id='detail_container']//li/span/text()", 'nodeValue').join('||');
      // const description = getXpath("//div[@id='detail_container']/div/text()", 'nodeValue');
      addElementToDocument('added_description', description);

      // let weightNet = getXpath("//div[@id='detail_container']//li/span[contains(text(),'Weight')]/text()", 'nodeValue');
      let weightNet = getXpath("//div[@id='Specifications']//table//tbody//th[contains(text(),'Weight')]//following-sibling::td/text()", 'nodeValue');
      if (weightNet != null && weightNet.includes(':')) {
        weightNet = weightNet.split(':')[1];
      }
      addElementToDocument('added_weightNet', weightNet);

      // let color = getXpath("//div[@id='detail_container']//li/span[contains(text(),'Color')]/text()", 'nodeValue');
      // if (color != null && color.includes(':')) {
      //   color = color.split(':')[1];
      // }
      // addElementToDocument('added_color', color);

      // const specifications = getAllXpath("//div[@id='Specifications']//div[@id='ProdSpecSection']/table/tbody/tr/th/text() | //div[@id='Specifications']//div[@id='ProdSpecSection']/table/tbody/tr/td/text()", 'nodeValue').join('|');
      const specifications = getAllXpath("//div[@id='Specifications']//div[@id='ProdSpecSection']/table/tbody/tr", 'innerText').join('|');
      addElementToDocument('added_specifications', specifications);

      let quantity = getXpath("//div[@id='detail_container']//li/span[contains(text(),'Capacity')]/text() | //div[@id='detail_container']//li/span[contains(text(),'size')]/text()", 'nodeValue');
      if (quantity != null && quantity.includes(':')) {
        quantity = quantity.split(':')[1];
        addElementToDocument('added_quantity', quantity);
      }

      const variantInformation = getXpath("//div[@class='sku-set__product_skuset']//select[@id='childProductSelection']//option[@selected]/text()", 'nodeValue');

      addElementToDocument('added_variantInformation', variantInformation);
      const manufacturerName = window.__PRELOADED_STATE__.skuState.skuData.items[0].product.manufacturerName;
      console.log('manufacturerName ' + manufacturerName);
      addElementToDocument('added_manufacturer', manufacturerName);
      const upcCode = window.__PRELOADED_STATE__.skuState.skuData.items[0].product.upcCode;
      console.log('upcCode ' + upcCode);
      addElementToDocument('added_gtin', upcCode);

      var variantCount = getAllXpath("//div[@class='sku-set__dropdown_duration']//select[@id='childProductSelection']/option", 'nodeValue').length;
      console.log('variantCount' + variantCount);
      addElementToDocument('added_variantCount', variantCount);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
