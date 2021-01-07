const { transform } = require('./format');

const implementation =  async (inputs,
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
  let prodUrl = '';
  if (isSearchPage) {
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
  try {
    await context.waitForSelector('iframe#desc_ifr');
  } catch (err) {
    console.log('manufacturer contents not loaded or unavailable');
  }
  const {src, productPage} = await context.evaluate(async function () {
    const iframe = document.querySelector('iframe#desc_ifr');
    const productPage = window.location.href
    // @ts-ignore
    const src = iframe ? iframe.src : '';
    return {src, productPage};
  });
  const redirect = await context.evaluate(async function () {
    let redirect = false;
    if (document.URL.includes('signin.ebay')) {
      redirect = true;
    }
    return redirect;
  });

  if (redirect === true) {
    const url = prodUrl? prodUrl : productPage
    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
  }
  if (src) {
    try {
      await context.setBypassCSP(true);
      await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      await context.waitForSelector('div#ds_div');
    } catch (error) {
      try {
        await context.setBypassCSP(true);
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('div#ds_div');
      } catch (error) {
        console.log('could not load page', error);
      }
    }
  }
  await context.extract(productDetails, { transform });
  try {
    console.log('returning to product page');
    await context.setBypassCSP(true);
    await context.goto(productPage, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('div#CenterPanelInternal');
  } catch (error) {
    console.log('returning to product page');
    await context.setBypassCSP(true);
    await context.goto(productPage, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('div#CenterPanelInternal');
  }
  return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
}



module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'ebay',
    transform,
    domain: 'ebay.com.au',
    zipcode: '',
  },
  implementation,
  };