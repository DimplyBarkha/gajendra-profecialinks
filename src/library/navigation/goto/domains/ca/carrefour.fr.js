module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.fr',
    timeout: 100000,
    country: 'FR',
    store: 'carrefour',
    zipcode: '',
  },
  implementation: async (
    { url },
    parameters,
    context,
    // @ts-ignore
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);

    const responseStatus = await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);

    const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title]), div.g-recaptcha";
    const maxRetries = 3;
    let numberOfCaptchas = 0;

    try {
      await context.waitForSelector(captchaFrame);
    } catch (error) {
      console.log("Didn't find Captcha.");
    }

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };

    const closePopUp = async () => {
      try {
        const cssCookiepopUp = 'button#footer_tc_privacy_button';
        await context.waitForSelector(cssCookiepopUp, { timeout });
        await context.evaluate(async (cssCookiepopUp) => {
          const cookieButton = document.querySelector(cssCookiepopUp);
          if (cookieButton) {
          // @ts-ignore
            cookieButton.click();
          }
        }, cssCookiepopUp);

        await context.evaluateInFrame('iframe', (cssCookiepopUp) => {
          const cookieButton = document.querySelector(cssCookiepopUp);
          if (cookieButton) {
          // @ts-ignore
            cookieButton.click();
          }
        }, cssCookiepopUp);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    const checkHardBlock = async () => {
      const isHardBlocked = await context.evaluateInFrame('iframe', () => {
        const blockedText = 'You have been blocked';
        const cssCaptchaBox = 'div.captcha__human__title';
        const captchaBox = document.querySelector(cssCaptchaBox);
        // @ts-ignore
        return captchaBox && captchaBox.innerText && captchaBox.innerText.includes(blockedText);
      });
      console.log(`isHardBlocked: ${isHardBlocked}`);
      return isHardBlocked;
    };

    const checkRedirection = async () => {
      try {
        await context.waitForXPath('//div[@id="products"] | //h1[@class="page-title"]', { timeout });
        console.log('Redirected to another page.');
        return true;
      } catch (e) {
        console.log('Redirection did not happen.');
        return false;
      }
    };

    let isCaptchaFramePresent = await checkExistance(captchaFrame);
    console.log('isCaptcha:' + isCaptchaFramePresent);

    while (isCaptchaFramePresent && numberOfCaptchas < maxRetries) {
      console.log('isCaptcha', true);
      ++numberOfCaptchas;

      // check if hard block, make it retry
      if (await checkHardBlock()) {
        console.log('We are hard block, throwing error to make it retry');
        throw new Error('Hard blocked');
      }

      // solve captcha if not hard blocked
      try {
        console.log(`Trying to solve captcha - count [${numberOfCaptchas}]`);
        // @ts-ignore
        // eslint-disable-next-line no-undef
        await context.evaluateInFrame('iframe', () => grecaptcha.execute());
        console.log('solved captcha, waiting for page change');
        await context.waitForNavigation({ timeout });
        await checkRedirection();
        isCaptchaFramePresent = await checkExistance(captchaFrame);
      } catch (e) {
        console.log('Captcha did not load');
      }
    }

    isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      throw new Error('Failed to solve captcha');
    }

    await closePopUp(); // cookie popup close
    await context.evaluate(async function () {
      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const addButton = document.querySelector('.modal__close');
        if (addButton) {
          // @ts-ignore
          addButton.click();
        }
      } catch (error) {
        console.log('error: ', error);
      }
      await infiniteScroll();

      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const productButton = document.querySelector('.pagination ~ #data-plp_produits .ds-product-card__shimzone--large>a');
        if (productButton) {
          // @ts-ignore
          productButton.click();
        }
      } catch (error) {
        console.log('product not found');
      }
    });
  },
};
