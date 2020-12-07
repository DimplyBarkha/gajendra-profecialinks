const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'ferguson',
    transform: transform,
    domain: 'ferguson.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    async function addUrl () {
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 5000) {
          break;
        }
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
      // if (document.querySelector('#added-searchurl') !== null) {
      //   document.querySelector('#added-searchurl').innerHTML = url;
      // } else {
      //   addHiddenDiv('added-searchurl', url);
      // }
    }
    await context.evaluate(addUrl);
    return await context.extract(productDetails, { transform: transformParam });
  },

};
