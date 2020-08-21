const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    transform,
    domain: 'douglas.de',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const spanDescription = getEleByXpath('//div[@class="rd__product-details__description__collapsible"]/span');
      if (spanDescription) {
        const descUl = document.evaluate('//ul[contains(@class,"rd__list rd__list--disc")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (descUl) {
          const spanEle = document.createElement('li');
          spanEle.textContent = spanDescription;
          descUl.appendChild(spanEle);
        }
      }

      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
