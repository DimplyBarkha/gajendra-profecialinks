const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'ceneo',
    transform: transform,
    domain: 'ceneo.pl',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.waitForSelector('div[class*="page-tab-content products"] div[class*="cat-list-top"] div[class*="cat-list-nav"] *[class*="cat-view__list"]', {timeout: 10000});
      await context.evaluate(async () => {
        let changeViewElm = document.querySelectorAll('div[class*="page-tab-content products"] div[class*="cat-list-top"] div[class*="cat-list-nav"] *[class*="cat-view__list"]')[0];
        if(changeViewElm) {
          if(!changeViewElm.className.includes("active")) {
            changeViewElm.click();
          } else {
            console.log('we already have list view');
          }
        } else {
          console.log('did not found any view chaging elment');
        }
      });
      
      

      async function stallOut ( ms ) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('waiting!!');
            resolve();
          }, ms);
        });
      }

      await stallOut(8000);

      const applyScroll = async function (context) {
        await context.evaluate(async function () {
          async function stall ( ms ) {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                console.log('waiting!!');
                resolve();
              }, ms);
            });
          }
          let scrollTop = 0;
          while (scrollTop !== 15000) {
            await stall(1000);
            scrollTop += 1000;
            window.scroll(0, scrollTop);
            console.log('scrolling now!!');
            if (scrollTop === 15000) {
              await stall(3000);
              break;
            }
          }
        });
      };
      
      await applyScroll(context);

      await stallOut(5000);

      console.log('successfully clicked the list view button and scrolled');
      

    } catch(err) {
      console.log('we got some error - ', err.message);
    }

    return await context.extract(productDetails, { transform });
    
  }
};
