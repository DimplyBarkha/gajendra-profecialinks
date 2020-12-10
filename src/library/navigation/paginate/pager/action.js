
/**
 *
 * @param {{
  *  nextLinkSelector: string,
  *  mutationSelector: string,
  *  loadedSelector: string,
  *  loadedXpath: string,
  *  spinnerSelector: string,
  *  pageCheckSelector: string,
  * }} inputs
  * @param { Record<string, any> } parameters
  * @param { ImportIO.IContext } context
  * @param { Record<string, any> } dependencies
  */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const {
    nextLinkSelector,
    mutationSelector,
    loadedSelector,
    loadedXpath,
    spinnerSelector,
    pageCheckSelector,
  } = inputs;
  if (spinnerSelector) {
    // this may replace the section with a loader
    const expectedPage = inputs.page; let currentPage;
    if (pageCheckSelector) {
      currentPage = await context.evaluate((pageCheckSelector) => document.querySelector(pageCheckSelector).innerText, pageCheckSelector);
    }
    console.log('BEFORE CLICK');
    console.log('currentPage: ', currentPage);
    console.log('expectedPage: ', expectedPage);

    do {
      const isCaptcha = async () => {
        return await context.evaluate(async function () {
          return !!document.querySelector('div.re-captcha');
        });
      };

      const solveCaptcha = async () => {
        console.log('isCaptcha', true);

        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: '.g-recaptcha',
          autoSubmit: true,
        });
        console.log('solved captcha, waiting for page change');
        const res = await Promise.race([
          context.waitForSelector('span[data-automation-id="zero-results-message"], .g-recaptcha, div[id="product-overview"]'),
          new Promise((r, j) => setTimeout(j, 2e4)),
        ]);

        console.log('Captcha vanished');
      };
      const MAX_CAPTCHAS = 3;
      const solveCaptchaIfNecessary = async () => {
        console.log('Checking for CAPTCHA');
        while (await isCaptcha() && captchas < MAX_CAPTCHAS) {
          if (backconnect) {
            throw Error('CAPTCHA received');
          }
          console.log('Solving a captcha');
          console.log('captcha start time:', new Date());
          await solveCaptcha();
          captchas += 1;
          console.log('captcha end time:', new Date());
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        if (await isCaptcha()) {
          if (!benchmark) {
            // we failed to solve the CAPTCHA
            console.log('We failed to solve the CAPTCHA');
            return context.reportBlocked('Blocked: Could not solve CAPTCHA, attempts=' + captchas);
          }
          return false;
        }
        return true;
      };

      await solveCaptchaIfNecessary();
      await context.click(nextLinkSelector);
      await solveCaptchaIfNecessary();
      await context.waitForFunction((selector) => {
        console.log(selector, document.querySelector(selector));
        return !document.querySelector(selector);
      }, { timeout: 20000 }, spinnerSelector);
      console.log('Spinner went away', spinnerSelector);

      await solveCaptchaIfNecessary();
      if (pageCheckSelector) {
        currentPage = await context.evaluate((pageCheckSelector) => document.querySelector(pageCheckSelector).innerText, pageCheckSelector);
        console.log('AFTER CLICK');
        console.log('currentPage: ', currentPage);
        console.log('expectedPage: ', expectedPage);
      }

      await solveCaptchaIfNecessary();
    } while (pageCheckSelector && (Number(currentPage) < Number(expectedPage)));
    return true;
  }

  if (mutationSelector) {
    // this may replace the section with a loader
    await Promise.all([
      context.click(nextLinkSelector),
      // possible race condition if the data returned too fast, but unlikely
      context.waitForMutuation(mutationSelector, { timeout: 20000 }),
    ]);
    return true;
  }

  if (nextLinkSelector) {
    console.log('Clicking', nextLinkSelector);
    await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 20000 });
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 20000 });
    }
    if (loadedXpath) {
      await context.waitForXPath(loadedXpath, { timeout: 20000 });
    }
    return true;
  }
  return false;
}

module.exports = {
  parameters: [],
  inputs: [],
  dependencies: {
  },
  implementation,
};
