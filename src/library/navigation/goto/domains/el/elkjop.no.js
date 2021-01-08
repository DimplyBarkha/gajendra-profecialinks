
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'elkjop.no',
    timeout: 30000,
    country: 'NO',
    store: 'elkjop',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'networkidle0', block_ads: false });
    async function autoScroll(page){
      await page.evaluate(async () => {
          await new Promise((resolve, reject) => {
              var totalHeight = 0;
              var distance = 100;
              var timer = setInterval(() => {
                  var scrollHeight = document.body.scrollHeight;
                  window.scrollBy(0, distance);
                  totalHeight += distance;
  
                  if(totalHeight >= scrollHeight){
                      clearInterval(timer);
                      resolve();
                  }
              }, 100);
          });
      });
  }
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
    try {
      await context.waitForSelector('div[id*="coiPage-1"] button[class*="coi-banner__accept"]');
    } catch (error) {
      console.log('cookie button not present');
    }
    try {
      await context.click('div[id*="coiPage-1"] button[class*="coi-banner__accept"]');
    } catch (error) {
      console.log('cookie button click failed!');
    }
    await autoScroll(context);
  },
};
