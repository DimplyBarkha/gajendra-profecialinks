
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'instacart.com',
    store: 'instacart_publix',
    zipcode: '32821',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    var wantedZip = '32821';
    let defaultZipcode;
    let defaultZipcodeData = "";
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const walmartUrl = 'https://www.instacart.com/store/walmart/search_v3/';
    await context.goto(walmartUrl, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    //await new Promise((resolve, reject) => setTimeout(resolve, 6000));
   // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    const getCurrentZip = async () => {
      return await context.evaluate(async function () {
        const element = document.querySelector("span[class='rmq-db5b060a']");
        if (element) {
          return element.textContent;
        }
        return null;
      });
    };
   // defaultZipcodeData = context.querySelector("span[class='rmq-db5b060a']");
  //  if (defaultZipcodeData) {
      // @ts-ignore
   //   defaultZipcode = defaultZipcodeData.value;
  //    console.log("defaultZipcodeData:::" + defaultZipcode);
  //  }
        
    if (getCurrentZip != wantedZip && typeof getCurrentZip != "undefined" && getCurrentZip != null) {
      const storeSelection = async () => {
        await context.evaluate(function () {
          console.log('my store');
          const mystore = document.querySelector('.rmq-92e48e80:nth-child(1)');
          // @ts-ignore
          if (mystore) mystore.click();
            });
        context.goto(url);
      };
      try {
        await context.waitForSelector('button[class="rmq-ffabcfb8"]', 3000)
       // await context.querySelector('button[class="rmq-ffabcfb8"]');
       // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        await context.ifThereClickOnIt('button[class="rmq-ffabcfb8"]');
       // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        await context.setInputValue("span[class='rmq-db5b060a']", wantedZip);
       // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        await context.ifThereClickOnIt('button div+ div');
        await context.waitForSelector('.ReactModal__Content--after-open', 3000);
       // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        await context.ifThereClickOnIt('.ReactModalPortal>div>div>button');
       // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        await storeSelection();
       // await new Promise((resolve, reject) => setTimeout(resolve, 8000));
      } catch (error) {
        console.log('Element not visible');
      }
    } else {
      console.log("in else ");
      await context.goto(url);
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  },
};