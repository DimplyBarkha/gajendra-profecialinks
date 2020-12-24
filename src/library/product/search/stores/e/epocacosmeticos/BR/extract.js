const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'epocacosmeticos',
    transform,
    domain: 'epocacosmeticos.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        let lastScrollPos = 0;
        while (scrollTop !== 7500) {
          await stall(500);
          lastScrollPos = scrollTop;
          scrollTop += 750;
          window.scroll(lastScrollPos, scrollTop);
          if (scrollTop === 7500) {
            await stall(5000);
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
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    await applyScroll(context);
    await context.evaluate(async function () {
      const URL = window.location.href;
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div.shelf-default.prateleira ul li.produtos-para-cabelos---epoca-cosmeticos')[index];
        originalDiv.appendChild(newDiv);
        console.log('child appended ' + index);
      }
      const product = document.querySelectorAll('div.shelf-default.prateleira ul li.produtos-para-cabelos---epoca-cosmeticos');
      // select query selector and loop and add div
      for (let i = 0; i < product.length; i++) {
        addHiddenDiv('search_url', URL, i);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
