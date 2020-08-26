const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'sephora',
    transform,
    domain: 'sephora.nz',
    zipcode: '',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(function() {
      document.cookie = "locale=au;";
    })

    const nameExtended = await context.evaluate(function() {

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      let name = [];
      let variant = '//span[contains(@class, "current-variant-name")]';
      let names = '//div[@class="basic-information-section"]//div[contains(@class, "product-")]';
      var variantCheck = document.evaluate( variant, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var namesCheck = document.evaluate( names, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      debugger
      if(namesCheck.snapshotLength > 0){
        let checkName1 = namesCheck.snapshotItem(0);
        let checkName2 = namesCheck.snapshotItem(1);
        let checkVariant = variantCheck.snapshotItem(0);
        if(checkName1){
          name.push(checkName1.textContent);
        }
        if(checkName2){
          name.push(checkName2.textContent);
        }
        if(checkVariant){
          name.push(checkVariant.textContent);
        }

        let fullName = name.join(" - ")
        addHiddenDiv('ii_nameExtended', fullName);
        debugger
      }
    
    })
    
    // await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform: transformParam });
  },
};
