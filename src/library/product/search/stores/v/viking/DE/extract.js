const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'viking',
    transform,
    domain: 'viking.de',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 10000) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 10000) {
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
        const popup = document.querySelector('.QSIWebResponsive');
        if (popup) {
          const button = document.querySelector('.QSIWebResponsive > div:last-child > div > div:last-child > button:last-child');
          // @ts-ignore
          button.click();
        }
      });
    };
    const addUrl = async function (context) {
      await context.evaluate(async function () {
        const url = document.location.href;
        const productList = document.querySelectorAll('li.search-results__result');
        productList.forEach(product => product.setAttribute('searchurl', url));
      });
    };

    await applyScroll(context);
    await addUrl(context);
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
