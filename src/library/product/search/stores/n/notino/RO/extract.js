const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RO',
    store: 'notino',
    transform: transform,
    domain: 'notino.ro',
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
    return await context.extract(productDetails, { transform: transformParam });
  },
  // implementation: async (inputs, parameters, context, dependencies) => {
  //   const { transform } = parameters;
  //   const { productDetails } = dependencies;
  //   await context.evaluate(() => {
  //     function addHiddenDiv (id, content, index) {
  //       const newDiv = document.createElement('div');
  //       newDiv.id = id;
  //       newDiv.textContent = content;
  //       newDiv.style.display = 'none';
  //       const originalDiv = document.querySelectorAll('ul#productsList li.item a')[index];
  //       originalDiv.parentNode.insertBefore(newDiv, originalDiv);
  //     }
  //     const product = document.querySelectorAll('ul#productsList li.item');
  //     const URL = window.location.href;
  //     for (let i = 0; i < product.length; i++) {
  //       const headerText = product[i].querySelector('ul#productsList li.item h2 span.name').textContent;
  //       // // @ts-ignore
  //       // aggrating = aggrating !== null ? aggrating.classList : '';
  //       // aggrating = aggrating[2] !== undefined ? aggrating[2].split('-')[2] : '';
  //       // // @ts-ignore
  //       // const productUrl = product[i].querySelector('span.product-name b a').href;
  //       addHiddenDiv('pd_productText', headerText, i);
  //       addHiddenDiv('pd_url', URL, i);
  //     }
  //   });
  //   return await context.extract(productDetails, { transform });
  // },
};
