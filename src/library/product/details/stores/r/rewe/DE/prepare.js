
module.exports = {
  implements: 'product/details/geo/prepare',
  parameterValues: {
    country: 'DE',
    domain: 'shop.rewe.de',
    store: 'rewe',
    zipcode: '',
  },
  implementation: async ({ id, URL, RPC, SKU, zipcode, storeId, postcode }, { country, domain, timeout }, context, dependencies) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 60000));
    await context.evaluate(async function () {
      const isCookieSelector = document.querySelector('button[id="uc-btn-accept-banner"]');
      if (isCookieSelector) {
        isCookieSelector.click();
      }
    });

    await context.evaluate(async function () {
      if (document.querySelector('div[id="cf-hcaptcha-container"] iframe')) {
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: 'div[id="cf-hcaptcha-container"] iframe',
          autoSubmit: true,
        });
        console.log('solved captcha, waiting for page change');
        console.log('Captcha vanished');
      }
    });

    await context.waitForSelector('div.search-service-rsTiles div.search-service-product a');
    const newUrl = await context.evaluate(function () {
      const tempUrl = document.querySelector('div.search-service-rsTiles div.search-service-product a');
      if (tempUrl) {
        return `https://shop.rewe.de${tempUrl.getAttribute('href')}`;
      }
    });

    console.log(`mamatha storeId${storeId}`);
    const url = newUrl;
    console.log('Mamatha1' + url);
    await context.waitForSelector('button.gbmc-header-link');
    await context.click('button.gbmc-header-link');
    await context.evaluate(async function () {
      const isCookieSelector = document.querySelector('button[id="uc-btn-accept-banner"]');
      if (isCookieSelector) {
        isCookieSelector.click();
      }
    });
    await context.waitForSelector('a.gbmc-change-zipcode-link');
    await context.click('a.gbmc-change-zipcode-link');
    await context.waitForSelector('input[data-testid="zip-code-input"]');
    await context.setInputValue('input[data-testid="zip-code-input"]', `${storeId}`);
    await context.waitForSelector('button[data-testid="service-btn"]');
    await context.click('button[data-testid="service-btn"]');
    await context.waitForNavigation(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  },
};
