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
    // async function addUrl () {
    //   function addHiddenDiv (id, content) {
    //     const newDiv = document.createElement('div');
    //     newDiv.id = id;
    //     newDiv.textContent = content;
    //     newDiv.style.display = 'none';
    //     document.body.appendChild(newDiv);
    //   }
    //   const url = window.location.href;
    //   addHiddenDiv('added-searchurl', url);
    // }
    // await context.evaluate(addUrl);
    await context.evaluate(() => {
      function addElementDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('ul[id="moreLoadedProducts"] div.plp-product-div div.product-tile-main')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const product = document.querySelectorAll('ul[id="moreLoadedProducts"] div.plp-product-div');
      for (let i = 0; i < product.length; i++) {
        const title = product[i].querySelector('ul[id="moreLoadedProducts"] div.plp-product-div .plp-prod-name').innerText;
        const url = window.location.href;
        addElementDiv('product-title', title.replace(/["']/g, ''), i);
        addElementDiv('added-searchurl', url, i);
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
