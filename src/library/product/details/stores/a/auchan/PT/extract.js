async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const checkNoresultXpath = async () => {
    return await context.evaluate(() => {
      const check = document.querySelector('div[class*="no-results"]');
      if (check) {
        return true;
      } else {
        return false;
      }
    });
  };
  const check = await checkNoresultXpath();
  console.log(`this is the value for check ${check}`);
  if (check) {
    console.log('no rows were returned');
    return;
  }
  const addOptionalWait = async (selector) => {
    try {
      await context.waitForSelector(selector, { timeout: 30000 });
      console.log(`${selector} loaded successfully`);
    } catch (e) {
      console.log(`${selector} did not load at all`, e.message);
      try {
        await context.waitForSelector(selector, { timeout: 30000 });
        console.log(`${selector} loaded successfully`);
      } catch (er) {
        console.log(`${selector} did not load at all`, er.message);
      }
    }
  };
  await addOptionalWait('div[class="product-item-header"] > a');
  const checkExistance = async (selector) => {
    return await context.evaluate((selector) => {
      return Boolean(document.querySelector(selector));
    }, selector);
  };
  const navigationSelector = 'div[class="product-item-header"] > a';
  await new Promise(resolve => setTimeout(resolve, 30000));
  const isPresent = await checkExistance(navigationSelector);
  console.log('isPresent', isPresent);
  if (isPresent) {
    // await context.click(navigationSelector);
    let gotoProdUrl = await context.evaluate(async (navigationSelector) => {
      console.log('need to get the prod url from', navigationSelector);
      let elm = document.querySelectorAll(navigationSelector);
      let thisUrl = '';
      if(elm && elm.length > 0) {
        if(elm[0].hasAttribute('href')) {
          thisUrl = 'https://www.auchan.pt' + elm[0].getAttribute('href');
        }
      }
      console.log('got this prod url', thisUrl);
      return thisUrl;
    }, navigationSelector);

    if(gotoProdUrl) {
      await context.goto(gotoProdUrl, { timeout: 30000 });
    }
    try {
      await context.waitForNavigation({ timeout: 30000 });
      await context.waitForSelector('span[class="item-price"]', { timeout: 30000 });
      console.log('navigation happened successfully');
    } catch(err) {
      console.log('got some error while going to the prod page', err.message);
    }
  }
  const cookiesSelector = 'button[id="cookies-accept"]';
  const isCookiePresent = await checkExistance(cookiesSelector);
  if (isCookiePresent) {
    await context.click(cookiesSelector);
    console.log('cookies button clicked successfully');
  }
  return await context.extract(productDetails, { transform });
}

const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'auchan',
    transform: cleanUp,
    domain: 'auchan.pt',
    zipcode: '',
  },
  implementation,
};
