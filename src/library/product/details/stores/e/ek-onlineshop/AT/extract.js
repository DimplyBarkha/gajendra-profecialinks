const { transform } = require('../shared');

async function implementation (
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
    await context.goto(pageUrl, { timeout: 20000, waitUntil: 'load', checkBlocked: true }); 

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
