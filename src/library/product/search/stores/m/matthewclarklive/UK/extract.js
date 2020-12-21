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
  ) =>{
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const applyScroll = async function (context) {
      if (context.click('a[id="ctl00_ctl06_lbEnterSiteYes"]')) {
        await new Promise((resolve, reject) => setTimeout(resolve, 8000));
        await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
      }
      if (context.click('a[id="ctl00_cookiescontinuebutton"]')) {
        await new Promise((resolve, reject) => setTimeout(resolve, 8000));
        await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
      }
      
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          await stall(1000);
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
    return await context.extract(productDetails, { transform });
  }

  
  };