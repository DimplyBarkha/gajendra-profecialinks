
const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,

  context,
  dependencies,

) {
  const { transform } = parameters;
  // const { productDetails } = dependencies;

  const timeout = parameters.timeout ? parameters.timeout : 15000;

  // await context.evaluate(async function () {
  //   var captchaBtn = document.querySelector('.recaptcha-checkbox-border');
  //   // document.querySelector('#recaptcha-anchor');
  //   console.log(captchaBtn,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  //   if(captchaBtn){
  //     // var btn = document
  //     console.log("@@@@@@@@@@@@@@@@@@@@@@@");
  //     captchaBtn.click();
  //     console.log("Click itTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  //   }
  // });

  // const captchaFrame = 'iframe[title="recaptcha challenge"]';
  // div[id="g-recaptcha"]> div > div > iframe[name="a-6y6x1xg2d1jh"]
  // console.log(url,"@@@@@@2");
  await context.waitForSelector('iframe[title="recaptcha challenge"]', { timeout: 15000 });
  const captchaFrame = 'iframe[title="recaptcha challenge"]';
  console.log('&&&&&&&&&&&&');
  if (captchaFrame !== null) {
    // const responseStatus = await context.goto( {
    //   firstRequestTimeout: 170000,
    //   timeout: 170000,
    //   waitUntil: 'load',
    //   checkBlocked: false,
    //   antiCaptchaOptions: {
    //     type: 'RECAPTCHA',
    //   // recaptcha
    //   },
    // });
    // console.log('status : ', responseStatus.status);

    // const captchaFrame = "iframe[src*='captcha']:not([title])";
    // const captchaFrame = 'div[id="g-recaptcha"]';
    // await context.waitForSelector(captchaFrame);
    const maxRetries = 4;
    let numberOfCaptchas = 0;

    try {
      await context.waitForSelector(captchaFrame);
    } catch (e) {
      console.log('error:', e);
    }

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const checkRedirection = async () => {
      try {
        await context.waitForNavigation({ timeout });
        await context.waitForXPath('//div[@class="page-content"]', { timeout });
        console.log('Redirected to another page.');
        return true;
      } catch (e) {
        console.log('error: without undescore ', e);
        return false;
      }
    };

    let isCaptchaFramePresent = await checkExistance(captchaFrame);
    console.log('isCaptcha:' + isCaptchaFramePresent);

    while (isCaptchaFramePresent && numberOfCaptchas < 4) {
      console.log('isCaptcha', true);
      ++numberOfCaptchas;
      await context.waitForNavigation({ timeout });
      try {
        console.log(`Trying to solve captcha - count [${numberOfCaptchas}]`);
        // @ts-ignore
        await context.evaluateInFrame('iframe', () => grecaptcha.execute()); // could't run locally
        console.log('solved captcha, waiting for page change');
        await context.waitForNavigation({ timeout });
        const redirectionSuccess = await checkRedirection();

        if (redirectionSuccess) {
          // await context.evaluate((url) => {
          //   window.location.href = url;
          // }, url);
          await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
          break;
        } else {
          await context.evaluate(() => {
            // eslint-disable-next-line no-unused-expressions
            window.location.reload;
          });
          await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
        }

        isCaptchaFramePresent = await checkExistance(captchaFrame);
      } catch (e) {
        console.log('error: without undescore ', e);
      }
    }

    isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      throw new Error('Failed to solve captcha');
    }
  }
  // });
  // await context.evaluate(async function () {
  //   var captchaBtn = document.querySelector('#recaptcha-anchor');
  //   console.log(captchaBtn,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%Extracttttttttt");
  //   if(captchaBtn){
  //     // var btn = document
  //     console.log("@@@@@@@@@@@@@@@@@@@@@@@");
  //     captchaBtn.click();
  //     console.log("Click itTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  //   }
  // });

  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      // el.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('added-searchurl', url);
  }
  await context.evaluate(addUrl);
  return await context.extract(dependencies.productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'newegg',
    transform: transform,
    domain: 'newegg.com',
    zipcode: "''",
    timeout: null,
  },
  implementation,
  dependencies: {
    // goto: 'action:navigation/goto',
    productDetails: 'extraction:product/search/stores/${store[0:1]}/${store}/${country}/extract',
  },
};
