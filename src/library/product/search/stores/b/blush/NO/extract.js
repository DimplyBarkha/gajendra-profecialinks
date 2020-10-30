const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'blush',
    transform,
    domain: 'blush.no',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const products = document.querySelectorAll('div.product-list-item');
      for (let i = 0; i < products.length; i++) {
        const price = products[i].querySelector('span.product-price-now') ? products[i].querySelector('span.product-price-now').innerText.replace(/\s/g, '') : '';
        const currency = products[i].querySelector('span.product-price-now-label') ? products[i].querySelector('span.product-price-now-label').innerText : '';
        products[i].setAttribute('priceId', `${currency} ${price}`);
        products[i].setAttribute('rank', `${lastProductPosition + i}`);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + products.length}`);
    });
    return await context.extract(productDetails, { transform });
  },
};
