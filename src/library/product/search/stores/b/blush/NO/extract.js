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
      const body = document.body;
      const html = document.documentElement;
      const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

      let scrollTop = 0;
      while (scrollTop <= pageHeight) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        scrollTop += 200;
        window.scroll(0, scrollTop);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      const products = document.querySelectorAll('div.product-list-item');
      for (let i = 0; i < products.length; i++) {
        const productUrl = products[i].querySelector('a.product-link.image-container') ? products[i].querySelector('a.product-link.image-container').getAttribute('href') : '';
        const productId = productUrl && productUrl.match(/\/(\d+)\//g) ? productUrl.match(/\/(\d+)\//g)[0].replace(/\//g, '') : '';
        products[i].setAttribute('productId', productId);
        const price = products[i].querySelector('span.product-price-now') ? products[i].querySelector('span.product-price-now').textContent.replace(/\s/g, '') : '';
        const currencyObj = products[i].querySelector('div.buy-button') ? products[i].querySelector('div.buy-button').getAttribute('data-initobject') : '';
        const currency = currencyObj && JSON.parse(currencyObj) ? JSON.parse(currencyObj).currency : '';
        products[i].setAttribute('priceid', `${currency} ${price}`);
        const thumbnails = products[i].getAttribute('productId') ? `https://www.blush.no/img/p/1200/${productId}.jpg` : '';
        if (thumbnails) products[i].setAttribute('thumbnails', thumbnails);
        const ratingCount = products[i].querySelector('span.review-count') ? products[i].querySelector('span.review-count').textContent.replace(/\(|\)/g, '') : '';
        if (ratingCount) products[i].setAttribute('ratingcount', ratingCount);
        const aggRating = products[i].querySelector('div.review span.rating-stars') ? products[i].querySelector('div.review span.rating-stars').getAttribute('title') : '';
        if (aggRating) products[i].setAttribute('aggrating', aggRating.replace(/(^\d+(\.?,?\d+)?).*/g, '$1').replace('.', ','));
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
