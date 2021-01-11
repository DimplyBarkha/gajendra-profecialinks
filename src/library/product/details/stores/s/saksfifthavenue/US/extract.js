const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'saksfifthavenue',
    transform: cleanUp,
    domain: 'saksfifthavenue.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      const isVisible = (element) => (!!(element).offsetWidth || (element).offsetHeight);

      async function addAttributes (node) {
        const inventory = document.evaluate('//div[contains(@class, "product-availability")]//ul[contains(@class, "availability-msg")]|//div[@id="waitlist"][not(contains(@class, "d-none"))]//div[contains(@class, "soldout")]', document, null, XPathResult.STRING_TYPE, null);
        if (inventory && inventory.stringValue) {
          node.setAttribute('inventory', inventory.stringValue);
        }
        const availText = document.evaluate('//button[contains(@class, "add-to-cart btn")][not(@disabled)]/@class', document, null, XPathResult.STRING_TYPE, null);
        if (availText && availText.stringValue) {
          node.setAttribute('availability', 'true');
        }
      }

      for (let i = 0; i < document.querySelectorAll('ul.size-attribute li[value="0"]').length; i++) {
        const element = document.querySelectorAll('ul.size-attribute li[value="0"]')[i];
        if (isVisible(element) === true) {
          element.querySelector('a').click();
          await delay(5000);
          const elm = element.querySelector('a');
          await addAttributes(elm);
        }
      }
    });
    await context.extract(productDetails);
  },
};
