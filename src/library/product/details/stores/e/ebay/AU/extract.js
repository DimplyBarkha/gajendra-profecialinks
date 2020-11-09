const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'ebay',
    transform,
    domain: 'ebay.com.au',
    zipcode: '',
  },
  // implementation,
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    //  await context.goto(inputs.domain, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    const pId = inputs.id;
    let productUrl = null;
    productUrl = await context.evaluate(async function (pId) {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      let productUrl = null;
      if (pId) {
        if (document.querySelector('input[class*="autocomplete-input"]')) {
          document.querySelector('input[class*="autocomplete-input"]').value = pId;
        }
        // document.getElementById("myText").value = "Johnny Bravo";
        if (document.querySelector('input[class*="btn-prim"]')) {
          document.querySelector('input[class*="btn-prim"]').click();
        }
        await stall(4500);
        if (document.querySelector('ul[class*="srp-results"] li:first-child')) {
          productUrl = document.querySelector('ul[class*="srp-results"] li:first-child div[class*="s-item__info"] >a').getAttribute('href');
        }
      }
      return productUrl;
    }, pId);
    if (productUrl !== null) {
      await context.goto(productUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    }
    // await context.evaluate(async function (){
    //     document.querySelector('ul[class*="srp-results"] li:first-child div[class*="s-item__info"] >a').click();
    //     function stall (ms)
    //       {
    //       return new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //       resolve();
    //       }, ms);
    //       });
    //       }
    //     await stall(4500);
    // });
    try {
      await context.waitForSelector('iframe#desc_ifr');
    } catch (err) {
      console.log('manufacturer contents not loaded or unavailable');
    }
    const src = await context.evaluate(async function () {
      const iframe = document.querySelector('iframe#desc_ifr');
      // @ts-ignore
      const src = iframe ? iframe.src : '';
      return src;
    });
    await context.extract(productDetails, { transform });
    if (src) {
      try {
        await context.setBypassCSP(true);
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('div#ds_div');
        return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
      } catch (error) {
        try {
          await context.setBypassCSP(true);
          await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
          await context.waitForSelector('div#ds_div');
          return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
        } catch (error) {
          console.log('could not load page', error);
        }
      }
    }
  },
};
