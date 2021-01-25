const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'viovet',
    transform: transform,
    domain: 'viovet.co.uk',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      // scroll
      const stall = (ms) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      };

      let scrollTop = 0;
      const scrollLimit = 3000;
      while (scrollTop <= scrollLimit) {
        await stall(1000);
        scrollTop += 500;
        window.scroll(0, scrollTop);
      }
    });

    await context.evaluate(async () => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      // add search url
      const searchUrl = window.location.href;
      addElementToDocument('searchUrl', searchUrl);

      const products = document.querySelectorAll('li[itemtype="http://schema.org/Product"]');
      const prefix = 'https://www.viovet.co.uk';
      const shortPrefix = 'https:';
      products.forEach((product, index) => {
        // set product url
        const productUrl = product.querySelector('a').getAttribute('href');
        product.setAttribute('product_url', prefix + productUrl);
        // set img url
        const imageUrl = product.querySelector('a img').getAttribute('src');
        product.setAttribute('image_url', shortPrefix + imageUrl);
      });
    });

    return await context.extract(productDetails, { transform });
  },
};
