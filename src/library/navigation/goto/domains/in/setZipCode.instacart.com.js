module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'instacart.com',
    store: 'instacart_publix',
    zipcode: null,
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    var wantedZip = '33770';
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    try {
      await context.click('a[data-identifier=storechooser_link]', 3000);
      await context.waitForSelector('button.rmq-92e48e80:nth-child(1)', 3000);
      await context.click('button.rmq-92e48e80:nth-child(1)', 3000);
      await context.waitForSelector('button[class=rmq-ffabcfb8]', 3000);
      await context.click('button[class=rmq-ffabcfb8]', 3000);
      await context.setInputValue('span[class=rmq-db5b060a]', wantedZip);
      await context.click('#location-chooser div+ div button', 1000);
      await context.waitForSelector('.ReactModal__Content--after-open', 3000);
      await context.click('.ReactModalPortal>div>div>button', 3000);
      await context.click('.rmq-92e48e80:nth-child(1)', 4000);
      console.log('store selection');
      const responseStatus = await context.goto(url, {
        firstRequestTimeout: 4000,
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: false,
        antiCaptchaOptions: {
          type: 'RECAPTCHA',
        },
      });
      console.log('Status :', responseStatus.status);
      console.log('URL :', responseStatus.url);
    } catch (error) {
      console.log('Zipcode is loading');
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  },
};
