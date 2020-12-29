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
    url = 'https://www.instacart.com/store/walmart/search_v3/';
    context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    var wantedZip = '33770';
    const storeSelection = async () => {
      await context.evaluate(function () {
        console.log('my store');
        const mystore = document.querySelector('.rmq-92e48e80:nth-child(1) .rmq-d9beaa7b');
        if (mystore) mystore.click();
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
      await context.click('.ReactModalPortal>div>div>button');
      // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
      // await context.click('div+ button');
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));
      await storeSelection();
      await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    } catch (error) {
      console.log('Element not visible');
    }
  },
};
