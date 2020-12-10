
module.exports = {
  implements: 'product/details/geo/prepare',
  parameterValues: {
    country: 'UK',
    domain: 'groceries.asda.com',
    store: 'asda',
    zipcode: '',
  },
  implementation: async ({ URL, RPC, SKU, zipcode, storeId, postcode }, { country, domain, timeout }, context, dependencies) => {
    await context.evaluate(async function () {
      if (document.querySelector('div.no-result')) {
        throw Error('We cant find any results for "Product Code", sorry about that.');
      }
    });
    await context.waitForSelector('div.search-page-content__products-tab-content ul li a[data-auto-id="linkProductTitle"]');
    const newUrl = await context.evaluate(function () {
      const tempUrl = document.querySelector('div.search-page-content__products-tab-content ul li a[data-auto-id="linkProductTitle"]');
      if (tempUrl) {
        return `https://groceries.asda.com${tempUrl.getAttribute('href')}`;
      }
    });
    console.log(`mamatha storeId${storeId}`);
    console.log(`mamatha postcode${zipcode}`);
    const url = newUrl;
    console.log('MAmatha1' + url);
    await context.waitForSelector('a[data-auto-id="btnSign"]');
    await context.click('a[data-auto-id="btnSign"]');
    await context.setInputValue('div[class="input-box"] input.email-phone-input', 'randomstring@randomstring.com');
    await context.waitForSelector('div[class="input-box"] input#password');
    await context.setInputValue('div[class="input-box"] input#password', 'Change123');
    await context.waitForSelector('button[type="submit"]');
    await context.click('button[type="submit"]');
    // await context.waitForSelector('');
    await context.evaluate(async function () {
      if (document.querySelector('div.g-recaptcha iframe')) {
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: 'div.g-recaptcha',
          autoSubmit: true,
        });
        console.log('solved captcha, waiting for page change');
        console.log('Captcha vanished');
      }
    });
    await context.evaluate(async function () {
      if (document.querySelector('div.mini-trolley__slot-expiry-messge')) {
        throw Error('Sorry your slot has expired.');
      }
    });
    await context.waitForSelector('a[data-auto-id="linkChangeSlot"]');
    await context.click('a[data-auto-id="linkChangeSlot"]');
    await context.waitForSelector('button[data-auto-id="linkChange"]');
    await context.click('button[data-auto-id="linkChange"]');
    await context.waitForSelector('input[data-auto-id="textFieldPostcode"]');
    await context.setInputValue('input[data-auto-id="textFieldPostcode"]', `${zipcode}`);
    await context.waitForSelector('button[data-auto-id="btnCheckPostCode"]');
    await context.click('button[data-auto-id="btnCheckPostCode"]');
    await context.waitForSelector(`input[id='${storeId}']`);
    await context.click(`input[id='${storeId}']`);
    await context.waitForSelector('button[data-auto-id="cncAvailableSlot"]');
    await context.click('button[data-auto-id="cncAvailableSlot"]');
    await context.waitForSelector('button[data-auto-id="btnChangeSlot"]');
    await context.click('button[data-auto-id="btnChangeSlot"]');
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  },
};
