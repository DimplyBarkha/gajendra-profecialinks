const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'carrefour_electronics',
    transform: cleanUp,
    domain: 'carrefour.es',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(async () => {
      const cookies = document.querySelector('button[class*=\'cookies__button\']');
      if (cookies) cookies.click();
    });
    await context.evaluate(async () => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }

      await infiniteScroll();

      const availabilityText = document.querySelector('div.buybox button[class*=\'add-to-cart\']')
        ? document.querySelector('div.buybox button[class*=\'add-to-cart\']') : '';
      if (availabilityText) {
        addElementToDocument('availability', 'In Stock');
      } else {
        addElementToDocument('availability', 'Out Of Stock');
      }
      const obj = window.dataLayer[0];
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty('productBrand')) {
        const brand = obj.productBrand;
        addElementToDocument('brand', brand);
      }
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty('productEAN')) {
        const gtin = obj.productEAN;
        addElementToDocument('gtin', gtin);
      }

      const ratingStars = document.querySelectorAll('div[class=\'buybox\'] span[class*=\'stars-rate-extended__star-container\'] svg');
      if (ratingStars.length) {
        let rating = 0;
        for (let i = 0; i < ratingStars.length; i++) {
          const fillAtr = ratingStars[i].getAttribute('fill');
          const starFillRateRegex = /\d+\.?(\d+)?/g;
          const starFillRate = parseFloat(starFillRateRegex.exec(fillAtr));
          rating += starFillRate;
        }
        addElementToDocument('aggregate_rating', rating);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
