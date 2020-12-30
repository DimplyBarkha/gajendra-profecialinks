const { transform } = require('../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const pageUrl = await context.evaluate(function () {
    return window.location.href;
  });
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
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };


  await context.setBlockAds(false);
  //await context.setLoadAllResources(true); 
  //await context.setLoadImages(true);
  //await context.setJavaScriptEnabled(true); 
  //await context.setAntiFingerprint(false);
  // await context.setUseRelayProxy(false);

  // await context.goto('https://media.flixcar.com/delivery/static/inpage/57/js/lazysizes.js');
  //   await context.evaluate(async function () {
  //     console.log(document.querySelector('h1.next-chapter'));
  //   });
  //   const text = await context.evaluate(async function () {
  //     return document.querySelector('body').innerText;
  //   });
  // elementID = 'manuf';
  // content = text;

  // going back to product page
  await context.goto(pageUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
  await applyScroll(context);
  await context.waitForSelector('#flix-inpage', {timeout: 30000});

  return context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'ek-onlineshop',
    transform,
    domain: 'ek-onlineshop.at',
    zipcode: '',
  },
  implementation
};
