
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'laredoute.fr',
    timeout: 68000,
    country: 'FR',
    store: 'laredoute',
    zipcode: '',
  },
  implementation: async (
    { url: longUrl },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36');
    let url = longUrl.split('.aspx#')[0];
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    const gotoOptions = {
      firstRequestTimeout: 60000,
      timeout,
      waitUntil: 'networkidle0',
      block_ads: false,
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    };
    const responseStatus = await context.goto(url, gotoOptions);
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);

    const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title])";
    const maxRetries = 3;
    let numberOfCaptchas = 0;

    try {
      await context.waitForSelector(captchaFrame);
    } catch (e) {
      console.log("Didn't find Captcha.");
    }

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };

    const checkRedirection = async () => {
      const newurl = await context.evaluate(() => window.location.href);
      return !newurl.includes(url);
    };

    let isCaptchaFramePresent = await checkExistance(captchaFrame);
    console.log('isCaptcha:' + isCaptchaFramePresent);

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

        if (redirectionSuccess) {
          console.log('Page was redirected');
          await context.goto(url, gotoOptions);
          await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
          break;
        }

        isCaptchaFramePresent = await checkExistance(captchaFrame);
      } catch (e) {
        console.log('Captcha did not load');
      }
    }

    isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      throw new Error('Failed to solve captcha');
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
