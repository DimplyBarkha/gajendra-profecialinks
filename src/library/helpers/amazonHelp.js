
module.exports.AmazonHelp = class {
  constructor (context, helpers) {
    this.context = context;
    this.helpers = helpers;
  }

  // Function which sets the locale on amazon.com
  async setLocale (wantedZip) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const shouldChangeAddress = await this.helpers.checkAndReturnProp('div#nav-global-location-slot', 'css', 'innerText');

    if (shouldChangeAddress && shouldChangeAddress.includes(wantedZip)) {
      return;
    }

    try {
      await this.helpers.checkAndClick('span#glow-ingress-line2.nav-line-2', 'css', 6000);
      await new Promise(r => setTimeout(r, 2000));
      try {
        await this.helpers.checkAndClick('a#GLUXChangePostalCodeLink', 'css', 6000);
      } catch (e) {}
      await this.helpers.checkAndClick('input[aria-label="or enter a US zip code"]', 'css', 6000, wantedZip);
      await this.helpers.checkAndClick('input[aria-labelledby="GLUXZipUpdate-announce"]', 'css', 6000);
      await this.context.evaluate(async function () {
        if (document.querySelector('input[aria-labelledby="GLUXZipUpdate-announce"]')) {
          document.querySelector('input[aria-labelledby="GLUXZipUpdate-announce"]').click();
        }
      });
      await this.helpers.checkAndClick('button[name="glowDoneButton"]', 'css', 6000);
    } catch (exception) {
      console.log('Failed to update zipcode!');
      throw exception;
    }

    await new Promise(r => setTimeout(r, 5000));
  }

  async handleErrorsAndCaptchas(url){
    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    console.log('benchmark', benchmark);
    const MAX_CAPTCHAS = 3;
    let captchas = 0;
    let lastResponseData;
    const isCaptcha = async () => {
      return await this.context.evaluate(async function () {
        const captchaEl = document.evaluate("//img[contains(@src,'/captcha/')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (captchaEl.snapshotLength) {
          return 'true';
        } else {
          return 'false';
        }
      });
    };
    const solveCaptcha = async () => {
      console.log('isCaptcha', true);
      await this.context.solveCaptcha({
        type: 'IMAGECAPTCHA',
        inputElement: 'form input[type=text][name]',
        imageElement: 'form img',
        autoSubmit: true,
      });
      const [response] = await Promise.all([
        console.log('solved captcha, waiting for page change'),
        this.context.waitForNavigation(),
        await new Promise(resolve => setTimeout(resolve, 3000)),
      ]);
      console.log('Captcha vanished');
    };
    const solveCaptchaIfNecessary = async () => {
      console.log('Checking for CAPTCHA', await isCaptcha());
      while (await isCaptcha() === 'true' && captchas < MAX_CAPTCHAS) {
        captchas++;
        if (backconnect) {
          throw Error('CAPTCHA received');
        }
        console.log('Solving a captcha', await isCaptcha(), captchas);
        await solveCaptcha();
      }
      if (await isCaptcha() === 'true') {
        if (!benchmark) {
          // we failed to solve the CAPTCHA
          console.log('We failed to solve the CAPTCHA');
          return this.context.reportBlocked(lastResponseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
        }
        return 'false';
      }
      return 'true';
    };
    const analyzePage = async () => {
      let status = 200;
      if (document.querySelector('a img[src*="503.png"], a[href*="ref=cs_503_link"]')) {
        status = 503;
      } else if (document.evaluate("//script[contains(text(),'PageNotFound')]", document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength > 0 || !!document.querySelector('a[href*="dogsofamazon"],img[alt*="unde"],img[alt*="Dogs"],img[alt*="hein"]')) {
        status = 404;
      }
      return { status };
    };
    const handlePage = async (lastResponseData) => {
      if (lastResponseData.status === 404 || lastResponseData.status === 410) {
        return true;
      }
      if (lastResponseData.status === 503) {
        const [response] = await Promise.all([
          console.log('Waiting for page to reload on homepage'),
          this.context.waitForNavigation(),
          console.log('Clicking 503 image'),
          await this.context.click('a img[src*="503.png"], a[href*="ref=cs_503_link"]'),
        ]);
        if (await solveCaptchaIfNecessary() === 'false') {
          return { status: false };
        }
        console.log('Go to some random page');
        const clickedOK = await this.context.evaluate(async function () {
          // Changed xpath to check for any link.
          const randomLinkEls = document.evaluate('//a[@href]', document, null, XPathResult.ANY_TYPE, null);
          const randomLinkEl = randomLinkEls.iterateNext();
          if (randomLinkEl) {
            // @ts-ignore
            randomLinkEl.click();
            return 'true';
          } else {
            return 'false';
          }
        });
        if (clickedOK === 'false') {
          console.log('Could not click a product, aborting... :/');
          return { status: false };
        } else {
          this.context.waitForNavigation();
        }
        console.log('Going back to desired page');
        lastResponseData = await this.context.goto(url, {
          timeout: 10000,
          waitUntil: 'load',
          checkBlocked: false,
          js_enabled: true,
          css_enabled: false,
          random_move_mouse: true,
        });
        console.log('lastResponseData', lastResponseData);
        if (!lastResponseData) {
          return { status: false };
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (await solveCaptchaIfNecessary() === 'false') {
          return { status: false };
        }
        return lastResponseData;
      }
    };
    const run = async () => {
      // do we perhaps want to go to the homepage for amazon first?
      lastResponseData = await this.context.goto(url, {
        timeout: 10000,
        waitUntil: 'load',
        checkBlocked: false,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      // Treating as 200 if no response.
      if (!lastResponseData.status) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      if ([200, 503, 410, 404].indexOf(lastResponseData.status) === -1) {
        console.log('Blocked: ' + lastResponseData.status);
        if (benchmark) {
          return;
        }
        if (backconnect) {
          throw Error('Bad response code: ' + lastResponseData.code);
        }
        return this.context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
      }
      if (await solveCaptchaIfNecessary() === 'false') {
        return;
      }
      let pageStatus = await this.context.evaluate(analyzePage);
      pageStatus = await handlePage(pageStatus);
      if (pageStatus && pageStatus.status && pageStatus.status !== 200) {
        pageStatus = await handlePage(pageStatus);
      }
      // Return for false status.
      if (pageStatus && !pageStatus.status) {
        return;
      }
      // Check if page still blocked after sencond try.
      if (pageStatus && pageStatus.status === 503) {
        return this.context.reportBlocked('Blocked: 503 error.');
      }
      const wrongLocale = await this.context.evaluate(async function () {
        const locationWarningPopupEl = document.evaluate("//div[contains(@id, 'glow-toaster-body') and not(//*[contains(text(), 'Amazon Fresh')])]/following-sibling::div[@class='glow-toaster-footer']//input[@data-action-type='SELECT_LOCATION']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (locationWarningPopupEl.snapshotLength > 0) {
          return 'true';
        } else {
          return 'false';
        }
      });
      if (await wrongLocale === 'true' && !benchmark) {
        console.log('wrongLocale', !benchmark, wrongLocale);
        console.log('Incorrect locale detected');
        if (backconnect) {
          throw new Error('Incorrect locale detected');
        }
        throw new Error('Incorrect locale detected');
      }
    };
    await run();
  }

};
