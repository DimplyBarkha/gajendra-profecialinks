const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'myntra',
    transform: transform,
    domain: 'myntra.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        const scrollBox = document.querySelector('body');
        const elemClick = scrollBox.querySelector('div#product-list-load-more button');
        let scrollTop = 0;
        while (scrollTop !== 6000 || elemClick) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (elemClick) elemClick.click();
          if (scrollTop === 6000) {
            await stall(1000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await context.evaluate(() => {
      function addElementToDocument (elem, id, value) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = value;
        newDiv.style.display = 'none';
        elem.appendChild(newDiv);
      }
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const arr = document.querySelectorAll('ul.results-base li.product-base');
      for (let i = 0; i < arr.length; i++) {
        addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
    });
    return await context.extract(productDetails);
  },
};
