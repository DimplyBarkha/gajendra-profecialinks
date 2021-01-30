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
            let allProdHaveId = false;
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

    let thumbnailImgsXpath = '//div[contains(@class,"product-tile")]//div[@class="lazy-load-image-holder lazy-loaded"]//img//@src';
    try {
      await context.waitForXPath(thumbnailImgsXpath);
      console.log('got some images');
    } catch(err) {
      console.log('got some error while waiting for images', err.message);
    }
    
    let imagesCount = await context.evaluate(async (thumbnailImgsXpath) => {
      let imagesElm = document.evaluate(thumbnailImgsXpath, document, null, 7, null);
      if(imagesElm) {
        return imagesElm.snapshotLength;
      }
      return 0;
    }, thumbnailImgsXpath);

    console.log('imagesCount', imagesCount);
    //await applyScroll(context);
    let xpath = '(//div[contains(@class,"product-tile")][@data-productid])[last()]';
    async function scrollToRec (xpath) {
      await context.evaluate(async (xpath) => {
        const element = document.evaluate(xpath, document, null, 7, null) || null;
        if (element && element.snapshotItem(0)) {
          element.snapshotItem(0).scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      }, xpath);
    }
    await scrollToRec(xpath);
    let thisTime = 0;
    while(imagesCount < 12 && thisTime < 70000) {
      try {
        await context.waitForXPath(thumbnailImgsXpath);
        console.log('got some more images');
      } catch(err) {
        console.log('got some error while waiting for images', err.message);
      }
      await new Promise(resolve => setTimeout(resolve, 10000));
      thisTime += 10000;
      imagesCount = await context.evaluate(async (thumbnailImgsXpath) => {
        let imagesElm = document.evaluate(thumbnailImgsXpath, document, null, 7, null);
        if(imagesElm) {
          return imagesElm.snapshotLength;
        }
        return 0;
      }, thumbnailImgsXpath);
    }
    console.log('waited for - thisTime', thisTime);

    console.log('imagesCount - finally', imagesCount);
    
    
    return await context.extract(productDetails, { transform });
  },
};