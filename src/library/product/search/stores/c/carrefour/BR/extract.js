const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'carrefour',
    transform,
    zipcode: '',
    domain: 'carrefour.com.br',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.waitForSelector('div[class="dib relative vtex-product-summary-2-x-imageContainer vtex-product-summary-2-x-imageStackContainer vtex-product-summary-2-x-hoverEffect"] > img', { timeout: 50000 });
      console.log('Image loaded successfully');
    } catch (e) {
      console.log('can not load the image');
    }
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          const searchUrl = window.location.href;
          const appendElements = document.querySelectorAll('div[class="vtex-search-result-3-x-galleryItem vtex-search-result-3-x-galleryItem--normal pa4"]');
          if (appendElements.length) {
            appendElements.forEach((element) => {
              if (element.getAttribute('searchurl') == null) {
                element.setAttribute('searchurl', searchUrl);
              }
            })
          }
          // var clickButton = document.querySelector('a[rel="next"]');
          // if (clickButton) {
          //   clickButton.click();
          // }
          if (scrollTop === 20000) {
            await stall(1000);
            break;
          }
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
        const searchUrl = window.location.href;
        const appendElements = document.querySelectorAll('div[class="vtex-search-result-3-x-galleryItem vtex-search-result-3-x-galleryItem--normal pa4"]');
        if (appendElements.length) {
          appendElements.forEach((element) => {
            if (element.getAttribute('searchurl') == null) {
              element.setAttribute('searchurl', searchUrl);
            }
          })
        }
      });
    };
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  }
};