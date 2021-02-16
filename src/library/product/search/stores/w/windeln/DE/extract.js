const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'windeln',
    transform,
    domain: 'windeln.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(8000);
          break;
        }
      }
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });

    await context.evaluate(async function () {
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const products = document.querySelectorAll('article.product-listing-item.windeln-de');
      for (let i = 0; i < products.length; i++) {
        const aggRating = products[i].querySelector('div.ratings-plp span.ratings-stars-average') ? products[i].querySelector('div.ratings-plp span.ratings-stars-average').textContent : '';
        if (aggRating) products[i].setAttribute('aggrating', aggRating.replace(/(^\d+(\.?,?\d+)?).*/g, '$1').replace('.', ','));

        const ratingCount = products[i].querySelector('div.ratings-stars') ? products[i].querySelector('div.ratings-stars').innerText.replace(/★|\(|\)|\s+/g, '') : '';
        if (ratingCount) products[i].setAttribute('ratingcount', ratingCount);
        products[i].setAttribute('rank', `${lastProductPosition + i}`);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + products.length}`);
    });
    return await context.extract(productDetails, { transform });
  },
};
