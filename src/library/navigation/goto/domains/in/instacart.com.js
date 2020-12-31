module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'instacart.com',
    timeout: 120000,
    country: 'US',
    store: 'instacart_publix',
    zipcode: null,
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const walmarturl = 'https://www.instacart.com/store/walmart/search_v3/';
    context.goto(walmarturl, { first_request_timeout: 100000, timeout, waitUntil: 'load', checkBlocked: true });
    var wantedZip = '33770';
    let defaultZipcode;
    let defaultZipcodeData = '';
    // Get the zipcode and check whether it is the required zipcode
    defaultZipcodeData = context.querySelector("span[class='rmq-db5b060a']");
    if (defaultZipcodeData) {
      // @ts-ignore
      defaultZipcode = defaultZipcodeData.value;
    }
    // console.log(defaultZipcode);
    // console.log(wantedZip);
    if (defaultZipcode !== wantedZip && typeof defaultZipcode !== 'undefined' && defaultZipcode !== null) {
      console.log('executed');
      console.log(defaultZipcode);
      // Store Selection
      const storeSelection = async () => {
        await context.evaluate(function () {
          console.log('my store');
          const mystore = document.querySelector('.rmq-92e48e80:nth-child(1) .rmq-d9beaa7b');
          if (mystore) mystore.click();
          window.location.href = url;
        });
      };
      try {
        await context.waitForSelector('button[class="rmq-ffabcfb8"]');
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        await context.click('button[class="rmq-ffabcfb8"]');
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        console.log('button clicked');
        await context.setInputValue("span[class='rmq-db5b060a']", wantedZip);
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        console.log('input value is set');
        await context.click('button div+ div');
        await context.waitForSelector('.ReactModal__Content--after-open');
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        await context.click('.ReactModalPortal>div>div>button');
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        await storeSelection();
        await new Promise((resolve, reject) => setTimeout(resolve, 8000));
      } catch (error) {
        console.log('Element not visible');
      }
    } else {
      context.goto(url);
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  },
};
