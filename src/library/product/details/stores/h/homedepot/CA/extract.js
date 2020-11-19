const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    transform,
    domain: 'homedepot.ca',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.click('localization-confirmation div:nth-child(1)>button');
      await new Promise(resolve => setTimeout(resolve, 30000));
    } catch (error) {
      console.log('no localized button found');
    }
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 1000;
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
    await new Promise(resolve => setTimeout(resolve, 50000));
    try {
      await context.waitForSelector('.hdca-product__description');
    } catch (error) {
      console.log('product description is not loaded');
    }
    await new Promise(resolve => setTimeout(resolve, 50000));
    try {
      await context.click('div.hdca-product__gallery > acl-product-image > div > acl-icon');
      await new Promise(resolve => setTimeout(resolve, 30000));
      await context.click('div.zoom-gallery-container > div.carousel-container > hdca-carousel > div > div > ngu-carousel > div > button.arrow.arrow--next');
      await new Promise(resolve => setTimeout(resolve, 30000));
    } catch (error) {
      console.log('no more images');
    }
    try {
      await new Promise(resolve => setTimeout(resolve, 30000));
      await context.click('.hdca-video__play');
      await new Promise(resolve => setTimeout(resolve, 30000));
    } catch (error) {
      console.log('no localized button found');
    }
    await new Promise(resolve => setTimeout(resolve, 50000));
    return await context.extract(productDetails, { transform });
  },
};
