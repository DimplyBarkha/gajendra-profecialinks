const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'matthewclarklive',
    transform: transform,
    domain: 'matthewclarklive.com',
    zipcode: '',
  },

  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        try {
          // @ts-ignore
          document.querySelector('a[id="ctl00_ctl06_lbEnterSiteYes"]').click()
          await new Promise(r => setTimeout(r, 6000));
        } catch (error) {
        }
        try {
          // @ts-ignore
          document.querySelector('a[id="ctl00_cookiescontinuebutton"]').click()
          await new Promise(r => setTimeout(r, 6000));
        } catch (error) {
        }
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          await stall(1000);
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);



    return await context.extract(productDetails, { transform });
  }


};