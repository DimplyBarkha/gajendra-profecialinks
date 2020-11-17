const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'tokmanni',
    transform: cleanUp,
    domain: 'tokmanni.fi',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("div[class='klevuImgWrap']")[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const getAllXpath = (xpath, prop) => {
        const Price1 = getAllXpath("//div[@class='kuSalePrice']/text()",'nodeValue');
        const Price2 = getAllXpath("//span[@class='ku-coins']/text()",'nodeValue');
        const Price3 = (Price1+'.'+Price2);
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
        };
      let rankOrganic;
      try {
        rankOrganic = ((window.location.href).indexOf('offset=')) ? Number((window.location.href).replace(/.*offset=(.*)/, '$1')) : 0;
      }
      catch (err) {
      }
      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = rankOrganic + 1;
      }
      const urlProduct = document.querySelectorAll("div[class='klevuImgWrap']");
      for (let i = 0; i < urlProduct.length; i++) {
        addHiddenDiv('rankOrganic', rankOrganic++, i);
      }

    });
    return await context.extract(productDetails, { transform });
  },
}