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
      const cookies = document.querySelector('div.cookie-consent-popup button');
      if (cookies) cookies.click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const products = document.querySelectorAll('div.product-list-item');
      for (let i = 0; i < products.length; i++) {
        console.log(products.length);
        const price = products[i].querySelector('span.product-price-now') ? products[i].querySelector('span.product-price-now').innerText.replace(/\s/g, '') : '';
        const currency = products[i].querySelector('span.product-price-now-label') ? products[i].querySelector('span.product-price-now-label').innerText : '';
        products[i].setAttribute('priceid', `${currency} ${price}`);
        const thumbnails = products[i].querySelector('img.product-image') ? products[i].querySelector('img.product-image').getAttribute('src') : '';
        if (thumbnails) products[i].setAttribute('thumbnails', `https://www.blush.no${thumbnails}`);
        const ratingCount = products[i].querySelector('span.review-count') ? products[i].querySelector('span.review-count').innerText.replace(/\(|\)/g, '') : '';
        if (ratingCount) products[i].setAttribute('ratingcount', ratingCount);
        const aggRating = products[i].querySelector('div.review span.rating-stars') ? products[i].querySelector('div.review span.rating-stars').getAttribute('title') : '';
        if (aggRating) products[i].setAttribute('aggrating', aggRating.replace(/(^\d+(\.?,?\d+)?).*/g, '$1').replace('.', ','));
        products[i].setAttribute('rank', `${lastProductPosition + i}`);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + products.length}`);
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
