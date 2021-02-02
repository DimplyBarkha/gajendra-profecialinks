
const implementation = async ({ url, id, zipcode, storeId }, { loadedSelector, noResultsXPath }, context, dependencies) => {
  if (!url) {
    if (!id) throw new Error('No id provided');
    else url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });
  const captchaButton = 'div.captcha-button button';
  const timeout = 30000;

  const isCaptcha = await context.evaluate(() => {
    return document.querySelector('div.captcha-button button');
  });

  console.log('isCaptcha? ', isCaptcha);

  if (loadedSelector && !isCaptcha) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
  } else {
    await context.waitForSelector(captchaButton);

    let b = 10;
    while (b > 0) {
      await context.evaluate(async function () {
        const captchaButton = document.querySelector('div.captcha-button button.emg-button.emg-btn-large.emg-btn-full');
        if (captchaButton) {
          console.log('Found button to captcha which i will try to .click() here it is ->', captchaButton);
          // @ts-ignore
          // eslint-disable-next-line no-undef
          captchaButton.click();
        }
      });
      const checkExistance = async (selector) => {
        return await context.evaluate(async (captchaSelector) => {
          return Boolean(document.querySelector(captchaSelector));
        }, selector);
      };
      const isCaptchaButtonPresent = await checkExistance('div.captcha-button button.emg-button.emg-btn-large.emg-btn-full');
      console.log('click with context.click("Selector")');
      if (isCaptchaButtonPresent) {
        await context.click('div.captcha-button button');
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      b--;
    }
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
        console.log('solved captcha, waiting for page change');

        await context.waitForNavigation({ timeout });
      } catch (e) {
        console.log('Captcha did not load');
      }
    }
    console.log('after captcha code');
    await context.waitForNavigation();
    const currentUrl = await context.evaluate(async () => {
      return window.location.href;
    });
    console.log('currentURL: ', currentUrl);
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
