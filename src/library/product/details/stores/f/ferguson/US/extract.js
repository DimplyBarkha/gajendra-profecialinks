const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'ferguson',
    transform: cleanUp,
    domain: 'ferguson.com',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const productUrl = await context.evaluate(async function () {
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
      const scriptText = getXpath('//script[@class="js-dataLayer"]', 'innerText');
      var reg = "('inStock' :)(.+)";
      var found = scriptText.match(reg);
      // console.log('scriptText' + found);
      // var scriptTextObj = JSON.parse(scriptText);
      addElementToDocument('added_inStock', found);
      const url = getXpath('//ul[@class="fg-search-results"]//li[1]//div[@class="rc-fg-search-header"]//a/@href', 'nodeValue');
      return url;
    });
    await context.goto(productUrl);
    await context.extract(productDetails, { transform: transformParam });
  },
};
