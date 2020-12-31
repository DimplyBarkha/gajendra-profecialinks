
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'melectronics.ch',
    timeout: 90000,
    country: 'CH',
    store: 'melectronics',
    zipcode: '',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    // let url = `${inputs.url}`;
    // await context.setBlockAds(false);
    // url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url);
    // async function autoScroll (page) {
    //   await page.evaluate(async () => {
    //     await new Promise((resolve, reject) => {
    //       var totalHeight = 0;
    //       var distance = 100;
    //       var timer = setInterval(() => {
    //         var scrollHeight = document.body.scrollHeight;
    //         window.scrollBy(0, distance);
    //         totalHeight += distance;

    //         if (totalHeight >= scrollHeight) {
    //           clearInterval(timer);
    //           resolve();
    //         }
    //       }, 100);
    //     });
    //   });
    // }
    // await autoScroll(context);
  },
};
