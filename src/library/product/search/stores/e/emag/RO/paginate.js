
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RO',
    store: 'emag',
    nextLinkSelector: null,
    nextLinkXpath: '//a[@aria-label="Next"]/span[contains(text(), "Pagina urmatoare")]/parent::a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="card_grid"]',
    noResultsXPath: '//span[text()="0 rezultate pentru:"]|//h1[@class="listing-page-title js-head-title"]//span[contains(text(), "0 rezultate")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'emag.ro',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { loadedSelector, noResultsXPath, resultsDivSelector } = parameters;

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

    const url = await context.evaluate(function () {
      /** @type { HTMLLinkElement } */
      const next = document.querySelector('head link[rel="next"]');
      if (!next) {
        console.log("Couldn't find selector for the next page");
        return false;
      }
      return next.href ? next.href : '';
    });

    if (!url) {
      console.log('no URL ---------------------------------');
      return false;
    }

    console.log('Going to url', url);
    await dependencies.goto({ url });
    console.log('Finished going on URL');

    let currentUrl;

    for (let i = 0; i < 3; i++) {
      currentUrl = await context.evaluate(async () => window.location.href);
      console.log(`current URL in pagination -----------> ${currentUrl}`);
      if (currentUrl === 'https://www.emag.ro/cart/products?ref=cart') {
        try {
          await dependencies.goto({ url });
          console.log('redirect to the proper page in pagination');
          await context.waitForNavigation();
        } catch (e) {
          console.log('Something went wrong, not able to wait for navigation');
        }
      } else {
        break;
      }
    }

    // Function checking whether an element matching a given selector exists
    const isPresent = async (selector) => await context.evaluate(
      async (captchaSelector) => !!document.querySelector(captchaSelector), selector);

    const captchaFrameSelector = 'iframe[title="testare reCAPTCHA"]';
    const isCaptchaButton = await context.evaluate(() => !!document.querySelector('div.captcha-button button'));
    console.log('isCaptchaButton? ', isCaptchaButton);

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
      try {
        await context.waitForSelector('input[id="searchboxTrigger"]', { timeout: 10000 });
      } catch (e) {
        console.log('Redirection failed');
      }
      // get current url and check if it indicates that captcha has been solved, if yes go again to product page if not throw error (throwing error will cause next retry of this crawl run task to occur)
      const currentUrl = await context.evaluate(async () => window.location.href);
      if (currentUrl !== 'https://www.emag.ro/?captcha_status=ok') {
        return false;
      } else {
        await context.goto(url, {
          firstRequestTimeout: 60000,
          timeout: 25000,
          waitUntil: 'load',
        });
        await context.waitForNavigation();
      }
    }
    console.log('Checking no results', noResultsXPath);

    if (resultsDivSelector) {
      // counting results
      const resultNB = await context.evaluate(sel => document.querySelectorAll(sel).length, resultsDivSelector);
      console.log(`The page has: ${resultNB} results. Pagination continues: ${!!resultNB}`);
      return !!resultNB;
    }

    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      const e = r.iterateNext();
      return !e;
    }, noResultsXPath);
  },
};
