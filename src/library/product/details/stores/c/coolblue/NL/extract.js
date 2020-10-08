const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    transform: transform,
    domain: 'coolblue.nl',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // append listprice in the DOM
      let getPrice;
      const getPriceSelector = document.querySelector('div.js-desktop-order-block span.sales-price__former-price');
      if (getPriceSelector) {
        getPrice = document.querySelector('div.js-desktop-order-block span.sales-price__former-price').textContent.trim().replace(/(\d+)(,?\.?)?(\d+)?(,-?)?/g, 'EUR $1,$3');
        document.body.setAttribute('newprice', getPrice);
      }
      // click on the image to get the alternate image info (no need to revert this as all the data is available in this situation too)
      const mainImageselector = document.querySelector('ul.product-media-gallery__wrapper>li');
      if (mainImageselector) {
        mainImageselector.click();
      }
    });
    await context.extract(productDetails);
  },
};
