
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'att',
    transform: null,
    domain: 'att.com',
    zipcode: "''",
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    const { createUrl, variants } = dependencies;
    await context.evaluate(function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        return newDiv;
      }
      try{
      const itemSelector = '//script[@type="application/json"][contains(text(),"skuItems")]';
      const items = document.evaluate(
        itemSelector,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );

      for (let i = 0; i < items.snapshotLength; i++) {
        let text = items.snapshotItem(i).textContent;
        
        const itemObj = JSON.parse(text);
        const pageProps = itemObj.props.pageProps;
        let mainUrl = pageProps.url; //JSON.stringify(pageProps.url);
        let suffix;
        if (mainUrl.indexOf('.') > -1) {
          suffix = mainUrl.substring(mainUrl.indexOf('.'));
          mainUrl = mainUrl.substring(0, mainUrl.indexOf('.'));
        }
        if (mainUrl.indexOf('/') > -1) {
          mainUrl = mainUrl.substring(0, mainUrl.lastIndexOf('/') + 1);
        }
        addHiddenDiv('mainUrl', mainUrl);
        const skus = itemObj.props.pageProps.productField.details.skuItems;

        let k = 0;
        for (const property in skus) {
          const sku = skus[property];
          addHiddenDiv(`${k}-my-url`, `https://www.att.com${mainUrl}${sku.uniqueURLName}${suffix}`);
          addHiddenDiv(`${k}-my-vId`, sku.skuId);
          k++;
        }
      }
      } catch(error){}
    }, createUrl);
    return await context.extract(variants);
    
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
