const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: '0815',
    transform: cleanUp,
    domain: '0815.at',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {

    await context.evaluate(async function () {
      async function infiniteScroll() {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
    });

    let skuScriptXpath = "//script[contains(@type,'application')][contains(.,'sku')]";
    let gotSku = false;
    let sku = '';
    let skuDivXpath = '//div[contains(@class,"product-detail-main")]//div[contains(text(),"EAN")]//following-sibling::div';

    let variantIdScriptXpath = "//script[contains(@type,'text')]";
    let gotVariantId = false;
    let variantId = '';
    let variantIdDivXpath = '//div[contains(@class,"product-detail-main")]//div[contains(text(),"Produkt-Nr.")]//following-sibling::div';

    try {
      await context.waitForXPath(skuDivXpath);
      gotSku = true;
    } catch (err) {
      console.log('we got some error while waiting for div containing ean', err.message);
      try {
        await context.waitForXPath(skuDivXpath);
        gotSku = true;
      } catch (err) {
        console.log('we got some error while waiting for div containing ean, again', err.message);
      }
    }

    if (gotSku) {
      sku = await context.evaluate(async (skuDivXpath) => {
        console.log('skuDivXpath', skuDivXpath);
        let skuElm = document.evaluate(skuDivXpath, document, null, 7, null);
        if (skuElm && skuElm.snapshotLength > 0) {
          let sku = skuElm.snapshotItem(0).textContent;
          if (sku) {
            return sku.trim();
          }
        }
        return '';
      }, skuDivXpath);
    }

    try {
      await context.waitForXPath(variantIdDivXpath);
      gotVariantId = true;
    } catch (err) {
      console.log('we got some error while waiting for div containing variantId', err.message);
      try {
        await context.waitForXPath(variantIdDivXpath);
        gotVariantId = true;
      } catch (err) {
        console.log('we got some error while waiting for div containing variantId, again', err.message);
      }
    }

    if (gotVariantId) {
      variantId = await context.evaluate(async (variantIdDivXpath) => {
        console.log('variantIdDivXpath', variantIdDivXpath);
        let variantElm = document.evaluate(variantIdDivXpath, document, null, 7, null);
        if (variantElm && variantElm.snapshotLength > 0) {
          let variantId = variantElm.snapshotItem(0).textContent;
          if (variantId) {
            return variantId.trim();
          }
        }
        return '';
      }, variantIdDivXpath);
    }

    if (!gotSku) {
      try {
        await context.waitForXPath(skuScriptXpath);
        gotSku = true;
      } catch (err) {
        console.log('we got some error while waiting for div containing ean', err.message);
        try {
          await context.waitForXPath(skuScriptXpath);
          gotSku = true;
        } catch (err) {
          console.log('we got some error while waiting for div containing ean, again', err.message);
        }
      }

      if (gotSku) {
        sku = await context.evaluate(async (skuScriptXpath) => {
          console.log('skuScriptXpath', skuScriptXpath);
          let skuElm = document.evaluate(skuScriptXpath, document, null, 7, null);
          if (skuElm && skuElm.snapshotLength > 0) {
            let skuText = skuElm.snapshotItem(0).textContent;
            if (skuText) {
              let sku = skuText.trim();
              let regex = /(.+)sku([":\s]+)([\d\w]+)(",)(.+)/g;
              sku = sku.replace(regex, '$3');
              console.log('sku', sku);
              return sku;
            }
          }
          return '';
        }, skuScriptXpath);
      }
    }

    console.log('gotSku', gotSku);
    console.log('finally - sku', sku);

    if (!gotVariantId) {
      try {
        await context.waitForXPath(variantIdScriptXpath);
        gotVariantId = true;
      } catch (err) {
        console.log('we got some error while waiting for div containing variantId', err.message);
      }

      if (gotVariantId) {
        variantId = await context.evaluate(async (variantIdScriptXpath) => {
          console.log('variantIdScriptXpath', variantIdScriptXpath);
          let variantElm = document.evaluate(variantIdScriptXpath, document, null, 7, null);
          if (variantElm && variantElm.snapshotLength > 0) {
            let variantText = variantElm.snapshotItem(0).textContent;
            if (variantText) {
              let variantId = variantText.trim();
              let regex = /productId(["':\s]+)([\d\w]+)(",)/g;
              variantId = variantId.replace(regex, '$2');
              console.log('variantId', variantId);
              return variantId;
            }
          }
          return '';
        }, variantIdScriptXpath);
      }

    }

    console.log('gotvariantId', gotVariantId);
    console.log('finally - variantId', variantId);



    await context.evaluate(async (sku, variantId) => {
      console.log('finally - sku', sku);
      console.log('finally - variantId', variantId);
      async function addElementToDocumentAsync(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        document.body.appendChild(catElement);
      }

      await addElementToDocumentAsync('sku', sku);
      await addElementToDocumentAsync('variantId', variantId);
    }, sku, variantId);


    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  }
};
