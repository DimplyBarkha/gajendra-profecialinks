const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    transform: transform,
    domain: 'mvideo.ru',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

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
          scrollTop += 5000;
          window.scroll(0, scrollTop);
          console.log('scrolling now!!');
          if (scrollTop === 15000) {
            await stall(1000);
            break;
          }
        }
      });
    };
    
    await applyScroll(context);

    console.log('waiting for some time');
    await new Promise(resolve => setTimeout(resolve, 3000));

    let allProdHaveId = false;
    let idXpath = '//div[@class="fl-product-tile c-product-tile "]/@data-productid';
    let maxTry = 3;
    let thisTry = 1;
    while(thisTry < maxTry) {
      if(!allProdHaveId) {
        try {
          await context.waitForXPath(idXpath);
          console.log('got the id');
          allProdHaveId = await context.evaluate(async (idXpath) => {
            let allIdElms = document.evaluate(idXpath, document, null, 7, null);
            if(allIdElms.snapshotLength === 12) {
              allProdHaveId = true;
            }
            console.log('ids we have', allIdElms.snapshotLength);
            return allProdHaveId;
          }, idXpath);
        } catch(err) {
          console.log('we have some error in while waiting for ids', err.message);
        }
      } else {
        console.log('we have all the prods ids');
        break;
      }
      thisTry++;
    }

    console.log('allProdHaveId', allProdHaveId);
    
    
    return await context.extract(productDetails, { transform });
  },
};