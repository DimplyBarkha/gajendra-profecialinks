const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'betta',
    transform,
    domain: 'betta.com.au'
  }, implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
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
    await applyScroll(context);

    try {
      await context.waitForSelector('div.product-delivery-tabs > div > iframe.zip-widget__iframe--type-productwidget', { timeout: 65000 });
    } catch (error) {
      console.log('No promotion');
    }
    
    await context.evaluate(async function () {
      const promoData = document.querySelectorAll('div.product-delivery-tabs > div > iframe.zip-widget__iframe--type-productwidget').length ? document.querySelectorAll('div.product-delivery-tabs > div > iframe.zip-widget__iframe--type-productwidget')[0].contentWindow.document.getElementsByTagName('section')[0] : null;

      if (promoData) {
        document.body.appendChild(promoData);
      }
    });
    

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  }
};
