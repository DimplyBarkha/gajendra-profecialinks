const{transform} = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.waitForSelector('.cookies-overlay-dialog__accept-all-btn', { timeout: 8000 });
    await context.evaluate(async function () {
      if (document.querySelector('.cookies-overlay-dialog__accept-all-btn')) {
        document.querySelector('.cookies-overlay-dialog__accept-all-btn').click();
      }
    });
  } catch (error) {
    console.log('No cookies pop-up.');
  }

  try {
    await context.waitForSelector('iframe[title="Flix-media-video-0"]');
  } catch(e) {
    console.log('Video in product information is not present');
  }

  // this script load late - hence waiting for it to ensure page loads properly.
  const xpathForScript = '//div[@id="details-tab"]//div[contains(@class,"product-details-tab")]//div[contains(@id,"flix-inpage")]//*[contains(@type,"text/javascript")]';

  const isScriptLoaded = await context.evaluate(async function (xpathForScript, reloadSec, maxTime) {
    let element = document.evaluate(xpathForScript, document, null, 7, null);
    window.scrollTo(0, document.body.scrollHeight);
    async function timeout(ms) {
      console.log('waiting for ' + ms + ' millisecs');
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    let count = 0;
    while (element.snapshotLength === 0) {
      count = count + reloadSec;
      element = document.evaluate(xpathForScript, document, null, 7, null);
      if (element && element.snapshotLength > 0) {
        console.log('script found');
        break;
      }
      await timeout(reloadSec);
      if (count >= maxTime) {
        console.log('script not found');
        return false;
      }
    }
    return true;
  }, xpathForScript, 500, 30000);

  if (isScriptLoaded) {
    console.log('we have the script - which takes most time to load')
  } else {
    console.log('script is not loaded yet - check with xpathForScript');
  }

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'ep',
    transform: transform,
    domain: 'ep.at',
    zipcode: '',
  },
  implementation,
};
