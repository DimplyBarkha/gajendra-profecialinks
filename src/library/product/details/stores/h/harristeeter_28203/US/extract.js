const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'harristeeter_28203',
    transform: cleanUp,
    domain: 'harristeeter.com',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    var url = await context.evaluate(async function () {
      return window.location.href;
    });

    var hasNutrition = await context.evaluate(async function () {
      hasNutrition = false;
      const productTabDetail = document.querySelector('div.product-tabs').innerHTML;

      if (productTabDetail.includes('Nutrition')) {
        hasNutrition = true;
      }
      return hasNutrition;
    });

    if (hasNutrition) {
      await context.goto(url + 'nutrition', { timeout: 10000, waitUntil: 'load', checkBlocked: true });
      var nutritionDetails = await context.evaluate(async function () {
        const getXpath = (xpath, prop) => {
          const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
          let result;
          if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
          else result = elem ? elem.singleNodeValue : '';
          return result && result.trim ? result.trim() : result;
        };

        const label = getXpath("//div[@class='smBorder']//label[@class='title']", 'innerText');
        console.log('label');
        console.log(label);
        return label;
      });
    }

    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(async function (nutritionDetails) {

    }, nutritionDetails);

    await context.extract(productDetails, { transform: transformParam });
  },
};
