
const implementation = async ({ url, id, zipcode, storeId }, { loadedSelector, noResultsXPath }, context, dependencies) => {
  if (!url) {
    if (!id) throw new Error('No id provided');
    else url = await dependencies.createUrl({ id });
  }

  async function waitForSolvedCaptcha () {
    let newContent = '';
    do {
      newContent = await context.content();
      // it seems even without clicking the button captcha can be solved, this piece of code makes the chances higher
      await context.evaluate(async function () {
        const captchaButton = document.querySelector('div.captcha-button button.emg-button.emg-btn-large.emg-btn-full');
        if (captchaButton) {
          console.log('Found button to captcha which i will try to .click() here it is ->', captchaButton.textContent);
          // @ts-ignore
          // eslint-disable-next-line no-undef
          captchaButton.click();
        }
      });
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    } while (!newContent.includes('submit'));
  }

  await dependencies.goto({ url, zipcode, storeId });
  const captchaButton = 'div.captcha-button button';
  const timeout = 30000;

  const isCaptcha = await context.evaluate(() => {
    return document.querySelector('div.captcha-button button');
  });

  console.log('isCaptcha? ', isCaptcha);

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  // if there is loadedSelector given and captcha is not present we should proceed as usual to extraction
  if (loadedSelector && !isCaptcha) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
    // if there is a captcha solve it (either captcha solving fails and throws error with will cause a retry of given task or it will navigate to product page after solved captcha and return 1 result found)
  } else {
    await context.waitForSelector(captchaButton);
    await waitForSolvedCaptcha();

    const captchaFrame = 'iframe[title="testare reCAPTCHA"]';
    const maxRetries = 3;
    let numberOfCaptchas = 0;
    try {
      await context.waitForSelector(captchaFrame);
    } catch (e) {
      console.log("Didn't find Captcha.");
    }

    while (numberOfCaptchas < maxRetries) {
      console.log('isCaptcha', true);
      ++numberOfCaptchas;
      await context.waitForNavigation({ timeout });
      try {
        console.log(`Trying to solve captcha - count [${numberOfCaptchas}]`);
        // @ts-ignore
        // eslint-disable-next-line no-undef
        await context.evaluateInFrame('iframe', () => grecaptcha.execute());
        await context.waitForNavigation({ timeout });
      } catch (e) {
        console.log('Captcha did not load');
      }
    }
    // wait for homepage to load
    await context.waitForNavigation();
    // get current url and check if it indicates that captcha has been solved, if yes go again to product page if not throw error (throwing error will cause next retry of this crawl run task to occur)
    const currentUrl = await context.evaluate(async () => {
      return window.location.href;
    });
    if (currentUrl !== 'https://www.emag.ro/?captcha_status=ok') {
      throw Error('CAPTCHA SOLVING METHOD FAILED');
    } else {
      await context.goto(url, {
        firstRequestTimeout: 60000,
        timeout: 25000,
        waitUntil: 'load',
      });
      await context.waitForNavigation();
    }
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
};

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RO',
    store: 'emag',
    domain: 'emag.ro',
    loadedSelector: 'div.main-container-inner',
    noResultsXPath: '//div[@class="big-box err404"]',
    zipcode: '',
  },
  implementation,
};
