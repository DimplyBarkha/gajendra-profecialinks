module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'groceries.asda.com',
    country: 'UK',
    store: 'asda',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    const url = `https://www.asda.com/login`;
    const zipcode = inputs.zipcode;
    const storeId = inputs.storeID;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, antiCaptchaOptions: { type: 'RECAPTCHA' } });
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.setInputValue('div[class="input-box"] input.email-phone-input', 'asdageorandom@randomstring.com');
    //await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.waitForSelector('div[class="input-box"] input#password');
    await context.setInputValue('div[class="input-box"] input#password', 'Random123');
    //await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.waitForSelector('button[type="submit"]');
    await context.click('button[type="submit"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      if (document.querySelector('#px-captcha > div.g-recaptcha')) {
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: '#px-captcha > div.g-recaptcha',
          autoSubmit: true,
        });
        console.log('solved captcha, waiting for page change');
        console.log('Captcha vanished');
      } else {
        console.log("Captcha not found");
      }
    });
    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  }
};