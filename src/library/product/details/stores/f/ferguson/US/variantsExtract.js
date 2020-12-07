module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'ferguson',
    transform: null,
    domain: 'ferguson.com',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { variants }) => {
    const productUrl = await context.evaluate(async function () {
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const url = getXpath('//ul[@class="fg-search-results"]//li[1]//div[@class="rc-fg-search-header"]//a/@href', 'nodeValue');
      return url;
    });
    await context.goto(productUrl);
    await context.extract(variants);
  },
};
