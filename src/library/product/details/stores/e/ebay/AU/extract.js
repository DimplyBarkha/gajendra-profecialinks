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
    // need to check if it redirects to product page or listing page
    const isSearchPage = await context.evaluate(async function () {
      try {
        const searchPageSelector = '.srp-results  li';
        if (document.querySelector(searchPageSelector)) {
          console.log('Now in a search page');
          return true;
        } else {
          console.log('Not on a search page');
          return false;
        }
      } catch (err) {
        console.log(err);
      }
    });

    const isProdPage = await context.evaluate(async function () {
      const prodPageSelector = 'div#CenterPanelInternal';
      if (document.querySelector(prodPageSelector)) {
        console.log('Now in a prod page');
        return true;
      } else {
        console.log('Not on a prod page');
        return false;
      }
    });
    let prodUrl = '';
    if (isSearchPage && !isProdPage) {
      try {
        prodUrl = await context.evaluate(async function () {
          let productUrl = null;
          if (document.querySelector('ul[class*="srp-results"] li:first-child')) {
            productUrl = document.querySelector('ul[class*="srp-results"] li:first-child div[class*="s-item__info"] >a').getAttribute('href');
          } else {
            console.log('product URL is not present');
            return false;
          }
          return productUrl;
        });
      } catch (err) {
        console.log(err);
      }
    }
    if (prodUrl) {
      await context.goto(prodUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    }

    // const pId = inputs.id;
    // //let producturl = null;
    // let producturl = await context.evaluate(async function (pId) {
    //   function stall(ms) {
    //     return new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         resolve();
    //       }, ms);
    //     });
    //   }
    //   let productUrl = null;
    //   if (pId) {
    //     if (document.querySelector('input[class*="autocomplete-input"]')) {
    //       document.querySelector('input[class*="autocomplete-input"]').value = pId;
    //     }
    //     // document.getElementById("myText").value = "Johnny Bravo";
    //     if (document.querySelector('input[class*="btn-prim"]')) {
    //       document.querySelector('input[class*="btn-prim"]').click();
    //     }
    //     await stall(4500);
    //     if (document.querySelector('ul[class*="srp-results"] li:first-child')) {
    //       productUrl = document.querySelector('ul[class*="srp-results"] li:first-child div[class*="s-item__info"] >a').getAttribute('href');
    //     }
    //   }
    //   return productUrl;
    // }, pId);
    // if (producturl !== null) {
    //   await context.goto(producturl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    // }
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

    const redirect = await context.evaluate(async function () {
      let redirect = false;
      if (document.URL.includes('signin.ebay')) {
        redirect = true;
      }
      return redirect;
    });

    if (redirect === true) {
      await context.goto(prodUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    }

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
