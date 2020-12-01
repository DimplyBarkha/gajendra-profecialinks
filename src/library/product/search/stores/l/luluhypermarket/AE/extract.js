const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'luluhypermarket',
    transform: transform,
    domain: 'luluhypermarket.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      };
      function addElementDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('[id="moreLoadedProducts"] div.plp-product-div div.product-tile-main')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const product = document.querySelectorAll('[id="moreLoadedProducts"] div.plp-product-div');
      for (let i = 0; i < product.length; i++) {
        const title = product[i].querySelector('[id="moreLoadedProducts"] div.plp-product-div .plp-prod-name').innerText;
        const url = window.location.href;
        addElementDiv('product-title', title.replace(/["']/g, ''), i);
        addElementDiv('added-searchurl', url, i);
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
