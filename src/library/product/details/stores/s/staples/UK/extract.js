
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    transform: cleanUp,
    domain: 'staples.co.uk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const productUrl = await context.evaluate(async function () {
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const url = getXpath('//div[@class="detailsBlk"]//div[@class="searchImgContainer"]//@href', 'nodeValue');
      const urlLatest = 'https://www.staples.co.uk' + url;
      // console.log(productUrl);
      return urlLatest;
    });
    await context.goto(productUrl);
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
      const price = getXpath('//div[@class="formRow"]//span[@id="SkuPriceUpdate"]//text()', 'nodeValue');
      const pricecurrency = getXpath('//div[@class="formRow"]//span[@content="GBP"]//text()', 'nodeValue');
      addElementToDocument('added_onlinepricecurrency', pricecurrency + price);
    });
    await context.extract(productDetails);
  },
};
