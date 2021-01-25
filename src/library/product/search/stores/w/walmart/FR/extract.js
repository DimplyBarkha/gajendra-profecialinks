const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'walmart',
    transform,
    domain: 'walmart.ca',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 5000) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 5000) {
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
    await applyScroll(context);
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
