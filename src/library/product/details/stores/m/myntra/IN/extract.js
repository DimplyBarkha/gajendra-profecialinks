const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'myntra',
    transform: cleanUp,
    domain: 'myntra.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 10000) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 10000) {
            await stall(1000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function getElementByXpath (path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      const data = document.querySelectorAll('script[type="application/ld+json"]');
      const json = data && data[1] && data[1].innerText ? JSON.parse(data[1].innerText) : '';
      if (json) {
        if (json.offers && json.offers.availability === 'InStock') {
          addElementToDocument('availability', 'In Stock');
        } else addElementToDocument('availability', 'Out of Stock');
        addElementToDocument('sku', json.sku);
        addElementToDocument('mpc', json.mpn);
      }
    });
    await context.extract(productDetails);
  },
};
