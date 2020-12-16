const { transform } = require('../../../../shared');
async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await context.evaluate(async () => {
    function addProp (selector, iterator, name, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(name, value);
    }

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    // scroll

    let scrollTop = 0;
    const scrollLimit = 10000;
    await stall(3000);
    while (scrollTop <= scrollLimit) {
      scrollTop += 1006;
      window.scroll(0, scrollTop);
      await stall(1000);
    }

    const priceSelector = document.querySelectorAll('div.mq-product-prices>h3');
    let price;

    for (let i = 0; i < priceSelector.length; i++) {
      price = priceSelector[i].textContent;
      price = price.replace('.', '');
      addProp('div.mq-product-img>div>a', i, 'rank', `${i + 1}`);
      addProp('div.mq-product-prices>h3', i, 'price', price);
    }
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    transform,
    domain: 'merqueo.com',
    zipcode: '',
  },
  implementation,
};
