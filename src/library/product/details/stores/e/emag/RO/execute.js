
const implementation = async ({ url, id, zipcode, storeId }, { loadedSelector, noResultsXPath }, context, dependencies) => {
  if (!url) {
    if (!id) throw new Error('No id provided');
    else url = await dependencies.createUrl({ id });
  }

  async function waitForSolvedCaptcha () {
    let newContent = '';
    let counter = 0;
    while (counter < 10) {
      newContent = await context.content();
      console.log('Captcha is solving????: \n', newContent);
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      counter++;
    }
  }

  await dependencies.goto({ url, zipcode, storeId });
  const captchaButton = 'div.captcha-button button';

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
