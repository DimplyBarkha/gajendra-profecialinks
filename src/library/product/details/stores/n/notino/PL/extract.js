const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'notino',
    transform: cleanUp,
    domain: 'notino.pl',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const productUrl = await context.evaluate(async function () {
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const url = getXpath('//ul[@id="productsList"]//li[@class="item"]//@href', 'nodeValue');
      const urlLatest = 'https://www.notino.pl' + url;
      return urlLatest;
    });
    console.log(productUrl);
    await context.goto(productUrl);
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      /*  @ts-ignore
      function stall (ms) {
        // @ts-ignore
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      */
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
      const image = getXpath("(//div[@class='styled__ImageWrapper-sz48g6-2 PneRI']//@src)");
      const alternateImageXpath = "//div[@class='sc-fzXfLX iWDbJM']//@src";
      const alternateImageStr = getAllXpath(alternateImageXpath, 'nodeValue').join(',');
      if (alternateImageStr && typeof alternateImageStr === 'string') {
        const alternateImageList = alternateImageStr.split(',');
        var uniqueAlternateImageList = alternateImageList.filter(function (item, pos) {
          return alternateImageList.indexOf(item) === pos;
        });
        uniqueAlternateImageList.forEach(function (imageUrlData) {
          if (image !== imageUrlData) {
            console.log('imageUrlDataimageUrlData ', imageUrlData);
            addElementToDocument('added_images', (imageUrlData));
          }
        });
      }

      // const price = getXpath('//div[@id="pd-price"]//span[1]//@content', 'nodeValue');
      const pricecurrency = getXpath('//div[@id="pd-price"]//span[2]//@content', 'nodeValue');
      // addElementToDocument('added_onlineprice', price);
      addElementToDocument('added_onlinepricecurrency', pricecurrency);

      const skuNumber = getXpath('//span[@class="styled__CodeBlock-mu8uqe-1 fuzqBd"]', 'innerText');
      addElementToDocument('added_skuNumber', skuNumber.split(':')[1]);
    });
    await context.extract(productDetails);
  },
};
