const { transform } = require('../format.js');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    transform: transform,
    domain: 'dm.de',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const closeRandomPopups = await context.evaluate(function () {
      return !!document.evaluate('//button[@data-dmid="layer-header-close-button"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    if (closeRandomPopups) {
      await context.click('button[data-dmid="layer-header-close-button"]');
    }

    const closeCookiesPopup = await context.evaluate(function () {
      return !!document.evaluate('//button[@data-dmid="cookiebar-ok"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    if (closeCookiesPopup) {
      await context.click('button[data-dmid="cookiebar-ok"]');
    }

    // to load all images
    await context.waitForXPath('//div[@data-dmid="product-image-container"]//img/@src');
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      await stall(9000);
      const productImage = document.querySelectorAll('div[data-dmid="product-image-container] img');
      if (productImage != null) {
        await new Promise((resolve, reject) => setTimeout(resolve, 9000));
      }
    });

    await context.evaluate(async () => {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      if (document.querySelector('[data-dmid=load-more-products-button]') != null) {
        while (document.querySelector('[data-dmid=load-more-products-button]').textContent === 'Mehr laden') {
          await new Promise((resolve, reject) => setTimeout(resolve, 12000));
          document.querySelector('[data-dmid=load-more-products-button]').click();
          await new Promise((resolve, reject) => setTimeout(resolve, 12000));
          let scrollTop = 0;
          while (scrollTop !== 10000) {
            await stall(500);
            scrollTop += 1000;
            window.scroll(0, scrollTop);
            if (scrollTop === 10000) {
              await stall(5000);
              break;
            }
          }
        }
      } else {
        const applyScroll = async function (context) {
          await context.evaluate(async function () {
            let scrollTop = 0;
            while (scrollTop !== 20000) {
              await stall(500);
              scrollTop += 1000;
              window.scroll(0, scrollTop);
              if (scrollTop === 20000) {
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
        applyScroll();
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
