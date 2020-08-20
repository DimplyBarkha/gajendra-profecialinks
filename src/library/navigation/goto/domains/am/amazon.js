/**
 *
 * @param { { url: string } } input
 * @param { { addressRegExp: RegExp, countryCode: string } } parameterValues
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

  const isCorrectCountry = () => {
    /**
     * @var HTMLElement
     */
    var addressElement = document.querySelector('#nav-global-location-slot #glow-ingress-line2');
    if (!addressElement) {
      throw new Error('Address element is not where we expect, cannot tell if this is the correct country or not');
    }
    // @ts-ignore Element cast here
    var websiteLocation = addressElement.innerText.trim();
    var postcode = /\d/.test(websiteLocation) ? websiteLocation : null;
    return Boolean(postcode || parameterValues.addressRegExp.test(websiteLocation));
  };

  if (isCorrectCountry()) {
    return;
  }

  const changedCountry = await context.evaluate(async (code) => {
    const response = await fetch('https://www.amazon.co.uk/gp/delivery/ajax/address-change.html', {
      headers: {
        accept: 'text/html,*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest',
      },
      body: `locationType=COUNTRY&district=${code}&countryCode=${code}&storeContext=generic&deviceType=web&pageType=Gateway&actionSource=glow&almBrandId=undefined`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    return response.ok;
  }, parameterValues.countryCode);

  if (!changedCountry) {
    throw new Error('Cannot change country');
  }

  lastResponseData = await context.goto(input.url, {
    waitUntil: 'load',
  });

  if (!isCorrectCountry()) {
    throw Error('Changing country failed');
  }
}

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    country: 'US',
    domain: 'amazon.us',
    store: 'amazon',
  },
  dependencies: {
    setZipCode: 'action:navigation/goto/domains/am/amazon.js',
  },
  implementation,
};
