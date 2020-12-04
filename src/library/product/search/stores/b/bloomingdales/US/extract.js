const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'bloomingdales',
    transform: transform,
    domain: 'bloomingdales.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    async function addUrl () {
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        if (index === 'url') {
          document.body.appendChild(newDiv);
        } else {
          const originalDiv = document.querySelectorAll('div.sortableGrid ul.items li.cell div.repeat-star-icon.rating')[index];
          // originalDiv.parentNode.insertBefore(newDiv, originalDiv);
          originalDiv.appendChild(newDiv);
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url, 'url');
      const aggregateRating = document.querySelectorAll('div.repeat-star-icon.rating');
      for (let k = 0; k < aggregateRating.length; k++) {
        // @ts-ignore
        let singleRating = aggregateRating[k].style.width;
        singleRating = singleRating.slice(0, singleRating.length - 1);
        singleRating = (5 * singleRating) / 100;
        singleRating = singleRating.toFixed(1);
        addHiddenDiv('added_aggregateRating', singleRating, k);
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 15000) {
          break;
        }
      }
    }
    await context.evaluate(addUrl);
    return await context.extract(productDetails, { transform: transformParam });
  },

};
