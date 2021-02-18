
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'drizly.com',
    timeout: null,
    country: 'US',
    store: 'drizly',
    zipcode: "''",
  },
  implementation : async (
    {url},
    parameters,
    context,
    dependencies,
  ) =>{
    
    const timeout = parameters.timeout ? parameters.timeout : 300000;

    const responseStatus = await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: 300000,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'HCAPTCHA',
      },
    });
    console.log('status : ', responseStatus.status);
    console.log('URL : ', responseStatus.url);
    
  const captchaFrame='iframe[title="Main content of the hCaptcha challenge"]';
    const maxRetries = 4;
    let numberOfCaptchas = 0;

    try{
      await context.waitForSelector(captchaFrame);
    }catch(e){
      console.log('error:', e);
    }
    
    const checkExistance = async(selector) =>{
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const checkRedirection= async () =>{
      try {
        await context.waitForNavigation({ timeout });
        await context.waitForXPath('//div[@class="product-container"]', { timeout });
        console.log('Redirected to another page.');
        return true;
      } catch (e) {
        console.log('error: without undescore ', e);
        return false;
      }
    };
    
    let isCaptchaFramePresent = await checkExistance(captchaFrame);
    console.log("isCaptcha:"+ isCaptchaFramePresent);

    while (isCaptchaFramePresent && 0 < 4) {
      console.log('isCaptcha', true);
      ++numberOfCaptchas;
      await context.waitForNavigation({ timeout });
      try {
        console.log(`Trying to solve captcha - count [${numberOfCaptchas}]`);
        await context.evaluateInFrame('iframe', () => grecaptcha.execute());  //could't run locally
        console.log('solved captcha, waiting for page change');
        await context.waitForNavigation({ timeout });
        const redirectionSuccess = await checkRedirection();

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
        console.log('error: without undescore ', e);
      }
    }

    isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      throw new Error('Failed to solve captcha');
    }
  
  }
};
