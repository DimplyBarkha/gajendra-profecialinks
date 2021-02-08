
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RO',
    store: 'emag',
    domain: 'emag.ro',
    url: 'https://www.emag.ro/search/{searchTerms}',
    loadedSelector: 'div[id="card_grid"]',
    noResultsXPath: '//span[text()="0 rezultate pentru:"]|//h1[@class="listing-page-title js-head-title"]//span[contains(text(), "0 rezultate")]//span[text()="0 rezultate pentru:"]',
    zipcode: '',
  },
  implementation: async ({ zipcode, keywords },
    { url, loadedSelector, noResultsXPath },
    context,
    dependencies,
  ) => {
    const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
    await dependencies.goto({ url: destinationUrl, zipcode });

    const clickCaptchaButton = async () => {
      await context.evaluate(async function () {
        // const captchaButton = document.querySelector('div.captcha-button button.emg-button.emg-btn-large.emg-btn-full');
        const captchaButton = document.querySelector('div.captcha-button button');
        if (captchaButton) {
          console.log('Found button to captcha which i will try to .click() here it is ->', captchaButton.textContent);
          captchaButton.click();
        }
      });
      try {
        await context.waitForSelector('iframe[title="testare reCAPTCHA"]', { timeout: 10000 });
      } catch (e) {
        console.log("Didn't find Captcha.");
        try {
          console.log('Clicking captcha button using context.click()');
          await context.click('div.captcha-button button');
          await context.waitForSelector('iframe[title="testare reCAPTCHA"]', { timeout: 10000 });
        } catch (e) {
          console.log('Captcha still not present');
        }
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    };

    // Function checking whether an element matching a given selector exists
    const isPresent = async (selector) => await context.evaluate(
      async (captchaSelector) => !!document.querySelector(captchaSelector), selector);

    const captchaFrameSelector = 'iframe[title="testare reCAPTCHA"]';
    const isCaptchaButton = await context.evaluate(() => !!document.querySelector('div.captcha-button button'));
    console.log('isCaptchaButton? ', isCaptchaButton);

    // if there is loadedSelector given and captcha is not present we should proceed as usual to extraction
    if (loadedSelector && !isCaptchaButton) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, loadedSelector, noResultsXPath);
    } else {
      // if there is a captcha solve it (either captcha solving fails and throws
      // error with will cause a retry of given task or it will navigate to product
      // page after solved captcha and return 1 result found)
      await clickCaptchaButton();

      let isCaptchaFramePresent = await isPresent(captchaFrameSelector);
      console.log('isCaptcha present:' + isCaptchaFramePresent);

      for (let i = 0; i < 3; i++) {
        if (isCaptchaFramePresent) {
          await context.waitForNavigation({ timeout: 30000 });
          try {
            console.log(`Trying to solve captcha - count [${i}]`);
            // @ts-ignore
            // eslint-disable-next-line no-undef
            await context.evaluateInFrame('iframe', () => grecaptcha.execute());
            await context.waitForNavigation({ timeout: 30000 });
            isCaptchaFramePresent = await isPresent(captchaFrameSelector);
          } catch (e) {
            console.log(`Waiting for navigation failed: ${i} try`);
          }
        } else {
          break;
        }
      }
      // wait for homepage to load
      await context.waitForSelector('input[id="searchboxTrigger"]', { timeout: 10000 });
      // get current url and check if it indicates that captcha has been solved, if yes go again to product page if not throw error (throwing error will cause next retry of this crawl run task to occur)
      const currentUrl = await context.evaluate(async () => window.location.href);
      if (currentUrl !== 'https://www.emag.ro/?captcha_status=ok') {
        throw Error('CAPTCHA SOLVING METHOD FAILED');
      } else {
        await context.goto(destinationUrl, {
          firstRequestTimeout: 60000,
          timeout: 25000,
          waitUntil: 'load',
        });
        await context.waitForNavigation();
      }
    }

    console.log('Checking no results', noResultsXPath);
    return await context.evaluate((xp) => {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, noResultsXPath);
  },
};
