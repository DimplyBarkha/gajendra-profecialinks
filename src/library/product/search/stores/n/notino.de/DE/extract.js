const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    transform,
    domain: 'notino.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    async function addUrl () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
    }
    await context.evaluate(addUrl);
    await context.evaluate(async function () {
      let count = document.querySelectorAll('ul[id="productsList"] li[data-product-code]').length;
      while (count <= 150) {
        if (document.querySelector('a[class="btn btn--secondary"]')) {
          // @ts-ignore
          document.querySelector('a[class="btn btn--secondary"]').click();
          await new Promise(resolve => setTimeout(resolve, 1000));
          count = document.querySelectorAll('ul[id="productsList"] li[data-product-code]').length;   
        } else {
          break;
        }      
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};

