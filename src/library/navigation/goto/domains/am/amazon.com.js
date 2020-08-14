/**
 *
 * @param { { url: string } } input
 * @param { { domain: any, loginPage: string } } parameterValues
 * @param { ImportIO.IContext } context
 * @param { { } } dependencies
 */
async function implementation (input, parameterValues, context, dependencies) {
  const MAX_CAPTCHAS = 3;

  // make sure CSS loading is off
  await context.setCssEnabled(false);

  let captchas = 0;

  /**
   * @var ImportIO.IResponse
   */
  let lastResponseData;

  const isCaptcha = async () => context.evaluate(() => Boolean(document.querySelector('img[src*="/captcha/"]')));

  const solveCaptcha = async () => {
    console.log('isCaptcha');

    const navigationFuture = await context.waitForNavigation();

    const captchaFuture = context.solveCaptcha({
      type: 'IMAGECAPTCHA',
      inputElement: 'form input[type=text][name]',
      imageElement: 'form img',
    });
    console.log('solved captcha, waiting for page change');

    await Promise.all([navigationFuture, captchaFuture]);

    console.log('Captcha vanished');
  };

  const solveCaptchaIfNecessary = async () => {
    console.log('Checking for CAPTCHA');
    while (await isCaptcha() && captchas < MAX_CAPTCHAS) {
      captchas++;
      await solveCaptcha();
    }
    if (await isCaptcha()) {
      // we failed to solve the CAPTCHA
      context.reportBlocked(lastResponseData.status, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
      return false;
    }
    return true;
  };

  const run = async () => {
    lastResponseData = await context.goto(input.url, {
      waitUntil: 'load',
    });

    if (lastResponseData.status === 404 || lastResponseData.status === 410) {
      return;
    }

    console.log('lastResponseData', lastResponseData);

    if (lastResponseData.status === 503) {
      console.log('Clicking 503 image');
      await context.clickAndWaitForNavigation('a img[src*="503.png"], a[href*="ref=cs_503_link"]');

      if (!(await solveCaptchaIfNecessary())) {
        return;
      }

      console.log('Go to some random page');
      const clickedOK = await context.evaluate(function () {
        // @ts-ignore
        const links = [...document.querySelectorAll('a[href*="/dp/"]')];
        if (links.length === 0) {
          return false;
        }
        links[Math.floor(links.length * Math.random())].click();
        return true;
      });

      if (!clickedOK) {
        console.log('Could not click a product, aborting... :/');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Going back to desired page');

      lastResponseData = await context.goto(input.url, {
        waitUntil: 'load',
      });
      console.log('lastResponseData', lastResponseData);
    }

    let status = lastResponseData.status;

    if (status === 404 || status === 410) {
      return;
    }

    if (status !== 200) {
      return context.reportBlocked(status, 'Blocked: ' + status);
    }

    if (!(await solveCaptchaIfNecessary())) {
      return;
    }

    // status can have changed now
    status = lastResponseData.status;

    if (status === 404 || status === 410) {
      return;
    }

    // This only currently works on product pages
    const wrongLocale = await context.evaluate(() => Boolean(document.querySelector('#contextualIngressPtLabel_deliveryShortLine > span')));

    if (wrongLocale) {
      console.log('Incorrect locale detected');
      return context.reportWrongGeocoding();
    }
  };

  await run();
}

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    country: 'US',
    domain: 'amazon.us',
    store: 'amazon',
  },
  implementation,
};
