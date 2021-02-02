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

    let skuScriptXpath = "//script[contains(@type,'application')][contains(.,'sku')]";
    let gotSku = false;
    let sku = '';
    let skuDivXpath = '//div[contains(@class,"product-detail-main")]//div[contains(text(),"EAN")]//following-sibling::div';
    try {
      await context.waitForXPath(skuDivXpath);
      gotSku = true;
    } catch(err) {
      console.log('we got some error while waiting for div containing ean', err.message);
      try {
        await context.waitForXPath(skuDivXpath);
        gotSku = true;
      } catch(err) {
        console.log('we got some error while waiting for div containing ean, again', err.message);
      }
    }

    if(gotSku) {
      sku = await context.evaluate(async (skuDivXpath) => {
        console.log('skuDivXpath', skuDivXpath);
        let skuElm = document.evaluate(skuDivXpath, document, null, 7, null);
        if(skuElm && skuElm.snapshotLength > 0) {
          let sku = skuElm.snapshotItem(0).textContent;
          if(sku) {
            return sku.trim();
          }
        }
        return '';
      }, skuDivXpath);
    }

    if(!gotSku) {
      try {
        await context.waitForXPath(skuScriptXpath);
        gotSku = true;
      } catch(err) {
        console.log('we got some error while waiting for div containing ean', err.message);
        try {
          await context.waitForXPath(skuScriptXpath);
          gotSku = true;
        } catch(err) {
          console.log('we got some error while waiting for div containing ean, again', err.message);
        }
      }

      if(gotSku) {
        sku = await context.evaluate(async (skuScriptXpath) => {
          console.log('skuScriptXpath', skuScriptXpath);
          let skuElm = document.evaluate(skuScriptXpath, document, null, 7, null);
          if(skuElm && skuElm.snapshotLength > 0) {
            let skuText = skuElm.snapshotItem(0).textContent;
            if(skuText) {
              let sku =  skuText.trim();
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

    await context.evaluate(async (sku) => {
      console.log('finally - sku', sku);
      async function addElementToDocumentAsync (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        document.body.appendChild(catElement);
      }

      await addElementToDocumentAsync('sku', sku);
    }, sku);


    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  }
};
