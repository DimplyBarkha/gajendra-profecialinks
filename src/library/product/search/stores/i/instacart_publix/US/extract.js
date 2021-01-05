const { transform } = require('../../../../shared');
const { Helpers } = require('../../../../../../helpers/helpers');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'instacart_publix',
    transform: transform,
    domain: 'instacart.com',
    zipcode: '32821',
  },
  dependencies: {
    productDetails: 'extraction:product/search/stores/${store[0:1]}/${store}/${country}/extract',
    helperModule: 'module:helpers/helpers',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    var wantedZipCode = '32821';
    const { helperModule: { Helpers } } = dependencies;
    const helper = new Helpers(context);
    const { transform } = parameters;
    const { productDetails } = dependencies;
    // const publixUrl = 'https://www.instacart.com/store/publix/search_v3/{searchTerms}';
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    try {
      await helper.ifThereClickOnIt('a[data-identifier=storechooser_link]', 3000);
     // await context.waitForSelector('button.rmq-92e48e80:nth-child(1)', 3000)
      await helper.ifThereClickOnIt('.rmq-92e48e80:nth-child(1)', 3000);
      //await context.waitForSelector('.rmq-ffabcfb8', 3000);
      await helper.ifThereClickOnIt('.rmq-ffabcfb8', 3000);
      await context.setInputValue('span[class=rmq-db5b060a]', wantedZipCode);
      await helper.ifThereClickOnIt('button div+ div', 3000);
      await helper.ifThereClickOnIt('div.ReactModal__Content--after-open');
      await helper.ifThereClickOnIt('.ReactModalPortal>div>div>button');
      await helper.ifThereClickOnIt('.rmq-92e48e80:nth-child(1)', 4000);
      console.log("store selection");
      //  const responseStatus = await context.goto(url, {
      //    firstRequestTimeout: 12000,
      //    timeout: timeout,
      //    waitUntil: 'load',
      //    checkBlocked: false,
      //    antiCaptchaOptions: {
      //      type: 'RECAPTCHA',
      //    },
      //  });
      //  console.log('Status :', responseStatus.status);
      //  console.log('URL :', responseStatus.url);
    } catch (error) {
      console.log("Zipcode is loading");
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  }
};
