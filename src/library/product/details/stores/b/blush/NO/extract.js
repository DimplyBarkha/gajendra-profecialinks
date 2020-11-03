const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'blush',
    transform: cleanUp,
    domain: 'blush.no',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      const cookies = document.querySelector('div.cookie-consent-popup button');
      if (cookies) cookies.click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const listPrice = document.querySelector('div.product-price-before') ? document.querySelector('div.product-price-before').innerText.replace(/[^\d,.]+/g, '') : '';
      const buyBtnObj = document.querySelector('div.buy-button') ? document.querySelector('div.buy-button').getAttribute('data-initobject') : '';
      const onlinePrice = buyBtnObj && JSON.parse(buyBtnObj) ? JSON.parse(buyBtnObj).priceFormatted : '';
      const currency = buyBtnObj && JSON.parse(buyBtnObj) ? JSON.parse(buyBtnObj).currency : '';
      addElementToDocument('onlineprice', `${onlinePrice} ${currency}`);
      if (listPrice) addElementToDocument('listprice', `${listPrice} ${currency}`);

      const aggRating = document.querySelector('div.product-main-info__body span.rating-stars') ? document.querySelector('div.product-main-info__body span.rating-stars').getAttribute('title').replace(/(\d+)\.?,?(\d+)?.+/g, '$1,$2') : '';
      addElementToDocument('aggRating', aggRating);

      const description = document.querySelector('div.product-responsive-info') ? document.querySelector('div.product-responsive-info').innerText.replace(/\s{2,}|\n{2,}|\t/g, ' ') : '';
      addElementToDocument('descId', description);
    });
    await context.extract(productDetails, { transform });
  },
};
