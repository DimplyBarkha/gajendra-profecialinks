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
          if (scrollTop >= 10000) {
            const next = document.querySelector('.pagination-wrap');
            if (next) {
              // @ts-ignore
              next.style.position = 'fixed';
              // @ts-ignore
              next.style.zIndex = '99';
              // @ts-ignore
              next.style.width = '500px';
              // @ts-ignore
              next.style.height = '500px';
              // @ts-ignore
              next.style.zIndex = '99';
              // @ts-ignore
              next.style.top = '50%';
              // @ts-ignore
              next.style.marginTop = '-250px';
              // @ts-ignore
              next.style.marginLeft = '-250px';
              // @ts-ignore
              next.style.left = '50%';
            }
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
          const button = document.querySelector(
            '.QSIWebResponsive > div:last-child > div > div:last-child > button:last-child',
          );
          // @ts-ignore
          button.click();
        }
        const cookies = document.querySelector('#onetrust-accept-btn-handler');
        if (cookies) {
          // @ts-ignore
          cookies.click();
        }
      });
    };
    const addUrl = async function (context) {
      await context.evaluate(async function () {
        const url = document.location.href;
        const productList = document.querySelectorAll(
          'li.search-results__result',
        );
        productList.forEach((product) =>
          product.setAttribute('searchurl', url),
        );
      });
    };
    await applyScroll(context);
    await addUrl(context);
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
