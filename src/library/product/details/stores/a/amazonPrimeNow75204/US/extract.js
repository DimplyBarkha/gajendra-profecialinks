const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow75204',
    transform: transform,
    domain: 'primenow.amazon.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // Get additional product info
      let productInfo = Array.from(document.querySelectorAll('#feature-bullets > ul > li > span')).map(elm => {
        if (!elm.querySelector('#replacementPartsFitmentBulletInner')) {
          const value = elm.textContent.trim();
          return `${value}`;
        }
      }).filter(elm => elm).join(' || ');
      productInfo = `${productInfo} ${document.querySelector('#productDescription>p') ? document.querySelector('#productDescription>p').textContent : ''}`;
      document.body.setAttribute('additional_product_info', productInfo);

      const specificationArray = Array.from(document.querySelectorAll('.prodDetTable tr')).map(elm => {
        const key = elm.querySelector('th').innerText;
        const value = elm.querySelector('td').textContent.trim();
        const specification = (`${key}: ${value}`);
        return specification;
      }).filter(elm => elm).join(' || ');
      document.body.setAttribute('specification', specificationArray);
    });
    await context.extract(productDetails);
  },
};
