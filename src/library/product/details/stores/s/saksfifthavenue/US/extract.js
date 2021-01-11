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
      // Get additional product info
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

      async function addAttributes(node) {
        const inventory = document.evaluate('//div[contains(@class, "product-availability")]//ul[contains(@class, "availability-msg")]|//div[@id="waitlist"][not(contains(@class, "d-none"))]//div[contains(@class, "soldout")]', document, null, XPathResult.STRING_TYPE, null);
        if (inventory && inventory.stringValue) {
          node.setAttribute('inventory', inventory.stringValue);
        }
        const availText = document.evaluate('//button[contains(@class, "add-to-cart btn")][not(@disabled)]/@class', document, null, XPathResult.STRING_TYPE, null);
        if (availText && availText.stringValue) {
          node.setAttribute('availability', 'true');
        }
      }
      for (let i = 0; i < document.querySelectorAll('ul.size-attribute li').length; i++) {
        const element = document.querySelectorAll('ul.size-attribute li')[i];
        element.querySelector('a').click();
        await delay(5000);
        const elm = element.querySelector('a');
        console.log(document.querySelector('ul.availability-msg li div') ? document.querySelector('ul.availability-msg li div').innerText : '')
        await addAttributes(elm);
      }
      // [...document.querySelectorAll('ul.size-attribute li')].map(element => {
      //   element.querySelector('a').click();
      //   const elm = element.querySelector('a');
      //   await addAttributes(elm);
      // });
    });
    await context.extract(productDetails);
  },
};
