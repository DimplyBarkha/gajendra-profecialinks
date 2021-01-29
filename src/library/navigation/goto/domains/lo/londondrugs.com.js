module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'londondrugs.com',
    timeout: 20000,
    country: 'CA',
    store: 'londondrugs',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId },
    parameters, context, dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    const maxRetries = 3;
    var lastResponseData;
    var isCaptchaFramePresent;

    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    let numberOfCaptchas = 0;
    await context.captureRequests();
    await context.setAntiFingerprint(false);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setUseRelayProxy(false);

    // await context.goto(url, {
    //   firstRequestTimeout: 60000,
    //   timeout: timeout,
    //   waitUntil: 'networkidle0',
    //   checkBlocked: true,
    //   block_ads: false,
    //   load_all_resources: true,
    //   images_enabled: true,
    //   load_timeout: 0,
    //   antiCaptchaOptions: {
    //     type: 'RECAPTCHA',
    //   },
    // });

    const captchaFrame = 'iframe[src*="https://geo.captcha"]';

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };

    const run = async () => {
      lastResponseData = context.goto(url, {
        firstRequestTimeout: 60000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: true,
        antiCaptchaOptions: {
          type: 'RECAPTCHA',
        },
      });
      isCaptchaFramePresent = await checkExistance(captchaFrame);

      while (isCaptchaFramePresent && numberOfCaptchas < maxRetries) {
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
          const redirectionSuccess = await checkRedirection();
          if (!redirectionSuccess) {
            throw new Error('ERROR: Failed to load product details page');
          }
          if (redirectionSuccess) {
            await context.evaluate((url) => {
              window.location.href = url;
            }, url);
            await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
            break;
          } else {
            await context.evaluate((url) => {
              // eslint-disable-next-line no-unused-expressions
              window.location.reload;
            });
            await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
          }

          isCaptchaFramePresent = await checkExistance(captchaFrame);
        } catch (e) {
          console.log('Captcha did not load');
          console.log(JSON.stringify(lastResponseData));
          // @ts-ignore
          return context.reportBlocked(lastResponseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + numberOfCaptchas);
        }
      }
    };

    try {
      await run();
    } catch (error) {
      console.log(`Error: ${error}`);
      // @ts-ignore
      return context.reportBlocked(lastResponseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + numberOfCaptchas);
    }

    const checkRedirection = async () => {
      try {
        await context.waitForSelector('#my-account-option, span[itemprop="productID"]', { timeout });
        console.log('Redirected to another page.');
        return true;
      } catch (e) {
        console.log('Redirection did not happen.');
        return false;
      }
    };

    // let isCaptchaFramePresent = await checkExistance(captchaFrame);

    isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      console.log('Failed to load captcha');
      // @ts-ignore
      return context.reportBlocked(lastResponseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + numberOfCaptchas);
    }
    async function autoScroll (page) {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }
    await autoScroll(context);
  },
};
