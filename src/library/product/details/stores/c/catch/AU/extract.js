const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'catch',
    transform,
    domain: 'catch.com.au',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise(resolve => setTimeout(resolve, 20000));
    await context.evaluate(async function () {

      function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      const packagingElem = document.createElement('div');

      packagingElem.id = 'specifications';
      packagingElem.prepend(getElementByXpath("//*[contains(text(),'Specifications')]/following::ul[1]"));

      document.body.append(packagingElem);
    })

    let thisTime = 0;
    const maxTime = 120000;
    const skuFromScriptXpath = '//script[contains(text(),"sku_id")]';
    let skuLoaded = await context.evaluate(async (skuFromScriptXpath) => {
      console.log('skuFromScriptXpath', skuFromScriptXpath);
      let elm = document.evaluate(skuFromScriptXpath, document, null, 7, null);
      if(elm && elm.snapshotLength > 0) {
        return true;
      }
      return false;
    }, skuFromScriptXpath);

    while((!skuLoaded) && (thisTime < maxTime)) {
      skuLoaded = await context.evaluate(async (skuFromScriptXpath) => {
        console.log('skuFromScriptXpath', skuFromScriptXpath);
        let elm = document.evaluate(skuFromScriptXpath, document, null, 7, null);
        if(elm && elm.snapshotLength > 0) {
          return true;
        }
        return false;
      }, skuFromScriptXpath);
      console.log('waiting for 10 secs');
      await new Promise(resolve => setTimeout(resolve, 10000));
      thisTime += 10000;
    }

    skuLoaded = await context.evaluate(async (skuFromScriptXpath) => {
      console.log('skuFromScriptXpath', skuFromScriptXpath);
      let elm = document.evaluate(skuFromScriptXpath, document, null, 7, null);
      if(elm && elm.snapshotLength > 0) {
        return true;
      }
      return false;
    }, skuFromScriptXpath);

    console.log('skuLoaded',skuLoaded);
    console.log('waited for', thisTime);

    const { transform } = parameters;
    const { productDetails } = dependencies;
    if(thisTime == 0) {
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    await context.extract(productDetails, { transform });
  },
};
