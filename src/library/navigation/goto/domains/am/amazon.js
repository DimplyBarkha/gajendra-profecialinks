/**
 *
 * @param { { url: string, zipcode: string? } } input
 * @param { { addressRegExp: RegExp, zipRegExp: RegExp, countryCode: string, domain: string } } parameterValues
 * @param { ImportIO.IContext } context
 * @param { { } } dependencies
 */
async function implementation({ url, zipcode }, { addressRegExp, zipRegExp, countryCode, domain }, context, dependencies) {

  /*************************************************
   * START VARIABLE AND FUNCTION DECLARATION
   *************************************************/

  const MAX_CAPTCHAS = 3;

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

  const handle503 = async () => {
    console.log('Clicking 503 image');
    await context.clickAndWaitForNavigation('a img[src*="503.png"], a[href*="ref=cs_503_link"]');

    if (!(await solveCaptchaIfNecessary())) {
      return false;
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
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Going back to desired page');

    lastResponseData = await context.goto(url, {
      waitUntil: 'load',
    });
    console.log('lastResponseData', lastResponseData);
    return true;
  };

  const isCorrectLocation = async () => {
    const addressText = await context.evaluate(() => {
      /**
       * @var HTMLElement
       */
      var addressElement = document.querySelector('#nav-global-location-slot #glow-ingress-line2');
      if (!addressElement) {
        throw new Error('Address element is not where we expect, cannot tell if this is the correct country or not');
      }
      // @ts-ignore Element cast here
      return addressElement.innerText.trim();
    });

    const m = zipRegExp.exec(addressText.toString());
    const zip = m && (m[1] || m[0]);

    console.log('Zip code', zip);

    const saysEnterYourAddress = addressRegExp.test(addressText.toString());

    if (zipcode) {
      return Boolean(zip && zip.toLowerCase() === zipcode.toLowerCase());
    }

    // either a zip or enter address is fine if not specified
    return Boolean(zipcode || saysEnterYourAddress);
  };

  const changeLocation = () => context.evaluate(async (country, zip) => {

    const body = zip
      ? `locationType=LOCATION_INPUT&zipCode=${zip}&storeContext=generic&deviceType=web&pageType=Gateway&actionSource=glow&almBrandId=undefined`
      : `locationType=COUNTRY&district=${country}&countryCode=${country}&storeContext=generic&deviceType=web&pageType=Gateway&actionSource=glow&almBrandId=undefined`;

    const response = await fetch('/gp/delivery/ajax/address-change.html', {
      headers: {
        accept: 'text/html,*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest',
      },
      body,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    return response.status;

  }, countryCode, zipcode);

  /*************************************************
   * START LOGIC
   *************************************************/

  // make sure CSS loading is off
  await context.setCssEnabled(false);

  // go to the page
  lastResponseData = await context.goto(url, {
    waitUntil: 'load',
  });

  // check if it's 404/410
  if (lastResponseData.status === 404 || lastResponseData.status === 410) {
    return;
  }

  console.log('lastResponseData', lastResponseData);

  // handle 503 block
  if (lastResponseData.status === 503) {
    if (!await handle503()) {
      context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
      return;
    }
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

  if (await isCorrectLocation()) {
    return;
  }

  if (await changeLocation() !== 200) {
    throw new Error(`Cannot change location (${changeLocation})`);
  }

  // reload the page to check that it worked ok
  lastResponseData = await context.goto(url, {
    waitUntil: 'load',
  });

  if (!await isCorrectLocation()) {
    throw Error('Changing location failed');
  }
}

module.exports = {
  implements: 'navigation/goto',
  dependencies: {
  },
  implementation,
};
