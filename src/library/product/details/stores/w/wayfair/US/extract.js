const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(5000);
        break;
      }
    }
    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    if (!document.querySelector('div.VisualOptionCard > div > div > label > input')) {
      var URL = document.querySelector('[property="og:url"]') ? document.querySelector('[property="og:url"]').getAttribute('content') : '';
      var id = URL.replace(new RegExp('(.+)(keyword=|piid=|redir=)(.+)', 'g'), '$3');
      var altId = document.querySelector('#form-add-to-cart > div > div > div > div > input[type=hidden]');
      var skuId = document.querySelector('[property="og:upc"]') ? document.querySelector('[property="og:upc"]').getAttribute('content') : '';
      if (altId) {
        document.body.setAttribute('variantid', altId.getAttribute('value'));
      } else if (skuId) {
        document.body.setAttribute('variantid', skuId);
      } else if (id) {
        document.body.setAttribute('variantid', id);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    transform,
    domain: 'wayfair.com',
  },
  implementation,
};
