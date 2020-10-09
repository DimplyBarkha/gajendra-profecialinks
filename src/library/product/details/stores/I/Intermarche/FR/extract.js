const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'Intermarche',
    transform: cleanUp,
    zipcode: '',
    domain: 'intermarche.com',
  },
  implementation: async ({ input }, { transform }, context, { productDetails }) => {
    // const closeSelector = '#didomi-notice-agree-button > span';
    // const checkPresence = async (closeSelector) => {
    //   return await context.evaluate((selector) => {
    //     return Boolean(document.querySelector(selector));
    //   }, closeSelector);
    // }
    // const test = checkPresence(closeSelector);
    // try {
    //   if (test) {
    //     console.log('present on the website', true);
    //     await context.click(closeSelector);
    //     console.log('click happened')
    //   }
    // } catch (e) {
    //   console.log('not able to click', true);
    // }

    // await new Promise(resolve => setTimeout(resolve, 60000));
    // try {
    //   await context.waitForSelector('div[class="product-price--unit ProductPrice__PriceUnit-w3194n-5 eJDoAw"]');
    // } catch (err) {
    //   console.log('selector did not load.');
    // }
    // await context.evaluate(() => {
    //   const popup = document.querySelector('#didomi-notice-agree-button > span');
    //   if (popup) {
    //     popup.click();
    //   }
    // });
    await context.evaluate(async () => {
      // Implementation for getting the availability
      const Ispresent = document.querySelector('#add-product-button > div > div > a');
      if (Ispresent) {
        const newDiv = document.createElement('div');
        newDiv.className = "avail";
        newDiv.setAttribute('availability', "In stock");
        const body = document.querySelector('body');
        if (body) {
          body.append(newDiv);
        }
      }
      // Implementation for getting the product description
      const isValid = Boolean(document.querySelectorAll('div[class="styled__ProductConditionnement-rc4bd7-2 kvnQKM"]').length);
      if (isValid) {
        const appendContent = document.querySelectorAll('div[class="styled__ProductConditionnement-rc4bd7-2 kvnQKM"]');
        let data = '';
        if (appendContent) {
          for (let i = 1; i < appendContent.length; i++) {
            data = data + " " + appendContent[i].innerText;
          }
        }
        const brandName = document.querySelector('div[class="styled__ProductLibelle-rc4bd7-1 fARrZk"]') && document.querySelector('div[class="styled__ProductLibelle-rc4bd7-1 fARrZk"]').innerText;
        let finalName = '';
        if (brandName) {
          finalName = brandName.concat(data);
          const nameDiv = document.createElement('div');
          nameDiv.className = 'productName';
          nameDiv.setAttribute("name", finalName);
          const body = document.querySelector('body');
          if (body) {
            body.append(nameDiv);
          }
        }
      }
      //Implementation for getting the Variant id
      const productLink = window.location.href;
      const targetValue = productLink.match(/(\d{13})/g)[0];
      const rpcDiv = document.createElement('div');
      rpcDiv.className = 'rpcValue';
      rpcDiv.setAttribute('rpc', targetValue);
      const appendElement = document.querySelector('body');
      if (appendElement) {
        appendElement.append(rpcDiv);
      }
    });
    return await context.extract(productDetails, { transform })
  },
};