const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    transform: transform,
    zipcode: '',
    domain: 'coolblue.be',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const prodUrl = await context.evaluate(async function() {
      const productUrlSelector = 'div.product-card div.product-card__title a';
      const prodUrlNode = document.querySelector(productUrlSelector);
      if(prodUrlNode && prodUrlNode.hasAttribute('href')) {
        return `https://www.coolblue.be`+prodUrlNode.getAttribute('href');
      } else {
        return null;
      }
    });
  
    const isProdPage = await context.evaluate(async function() {
      const prodPageSelector = 'h1 span[class*=product-name]'
      if(document.querySelector(prodPageSelector)) {
        return true;
      } else {
        return false;
      }
    }); 
  
    if(prodUrl && !isProdPage){
      await context.goto(prodUrl, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
    }
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
