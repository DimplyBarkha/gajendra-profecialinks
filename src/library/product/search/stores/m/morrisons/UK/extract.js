const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    // scroll
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    var prodContainer = document.querySelectorAll(
      'li[class="fops-item fops-item--cluster"]',
    );
    prodContainer.forEach((element, index) => {
      element.setAttribute('rank', (index + 1).toString());
    });

    var rawNumber = document.querySelector('div[class="total-product-number"]').textContent;
    const regex = /\d+/gm;
    var match = parseInt(rawNumber.match(regex)[0]);
    if (match > 150) match = 150;

    let scrollTop = 0;
    const scrollLimit = match * 40;
    while (scrollTop <= scrollLimit) {
      await stall(1000);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    transform: transform,
    domain: 'groceries.morrisons.com',
    zipcode: '',
  },
  implementation,
};
