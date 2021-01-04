
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boots.ie',
    country: 'IE',
    store: 'boots',
    zipcode: '',
    timeout: 50000,
  },
  implementation: async ({ url }, { country, domain, timeout }, context, dependencies) => {
    await context.setBlockAds(false);
    const newUrl = await context.evaluate(function (url) {
      const searchTerm =
        url.match(/https:\/\/www.boots.ie\/sitesearch\?searchTerm=(.+)/) &&
        url
          .match(/https:\/\/www.boots.ie\/sitesearch\?searchTerm=(.+)/)[1]
          .toLowerCase();
      if (searchTerm &&
          searchTerm.match(/[a-zA-Z]+/g) &&
          searchTerm.match(/[a-zA-Z]+/g).length === 1 &&
          searchTerm.match(/dyson/i)
      ) {
        return 'https://www.boots.ie/dyson/dyson-shop-all';
      } else {
        return false;
      };
    }, url);
    url = newUrl || url;
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'networkidle0', block_ads: false, antiCaptchaOptions: { type: 'RECAPTCHA' } });
    const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title])";
    try {
      await context.waitForSelector(captchaFrame);
    } catch (e) {
      console.log('Captcha frame not found', e);
    }
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      console.log('isCaptcha', true);
      await context.waitForNavigation({ timeout });
      // @ts-ignore
      // eslint-disable-next-line no-undef
      // await context.evaluateInFrame('iframe', () => grecaptcha.execute());
      // console.log('solved captcha, waiting for page change');
      // await context.waitForNavigation({ timeout });
      // try {
      //   await context.waitForSelector('#corePage');
      // } catch (e) {
      //   console.log('Details page selector not found');
      // }
      // const solveCaptchaRetry = async () => {
      //   console.log('..retrying solveCaptcha..');
      //   await context.evaluateInFrame('iframe', () => grecaptcha.execute());
      //   console.log('solved captcha, waiting for page change');
      //   await context.waitForNavigation({ timeout });
      //   try {
      //     await context.waitForSelector('#corePage');
      //   } catch (e) {
      //     console.log('Details page selector not found');
      //   }
      // }
      const cssCaptcha = '#challenge-container';
      const solveCaptcha = async () => {
        console.log('..solveCaptcha..');
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: cssCaptcha,
        });
        console.log('solved captcha, waiting for page change');
        context.waitForNavigation({ timeout });
        // await context.reload(); // This is optional based on the website behavior.
        await new Promise(r => setTimeout(r, 500));

        try {
          await context.waitForSelector('.row');
        } catch (e) {
          console.log('Details page selector not found');
          // await solveCaptchaRetry();
        }
      };
      await solveCaptcha();
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
