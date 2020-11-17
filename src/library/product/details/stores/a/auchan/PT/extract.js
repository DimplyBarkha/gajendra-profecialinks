async function implementation (
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
      console.log(`${selector} did not load at all`);
    }
  };
  addOptionalWait('div[class="product-item-header"] > a');
  const checkExistance = async (selector) => {
    return await context.evaluate((selector) => {
      return Boolean(document.querySelector(selector));
    }, selector);
  };
  const navigationSelector = 'div[class="product-item-header"] > a';
  const isPresent = await checkExistance(navigationSelector);
  if (isPresent) {
    await context.click(navigationSelector);
    await context.waitForNavigation({ timeout: 30000 });
    await context.waitForSelector('span[class="item-price"]', { timeout: 30000 });
    console.log('navigation happened successfully');
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
