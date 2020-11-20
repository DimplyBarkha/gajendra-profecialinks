const { transform } = require('../../../../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;  
  await context.evaluate(async () => {
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.className = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class*=MuiCardContent-root]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    while (!!document.querySelector('#ahl-product-list-app > div > div >button')) {
      // @ts-ignore
      document.querySelector('#ahl-product-list-app > div > div >button').click()
      await new Promise(r => setTimeout(r, 6000));
    }
    // Method to Retrieve Xpath content of a Multiple Nodes
    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };
    const sliceURL = (data) => {
      for (let index = 0; index < data.length; index++) {
        var temp;
        if (data[index].includes(",")) {
          var temp = data[index].replace(",", ".");
        } else if (data[index].includes(" ")) {
          temp = data[index].replace(" ", "");
        } else {
          temp = data[index]
        }

        addHiddenDiv('zz', temp, index);
      }
    };
    var backgroundURL = getAllXpath("//*[contains(@class,'MuiCardContent-root')]/div/div/span[1]/text()", 'nodeValue');
    sliceURL(backgroundURL);
  })
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform: transform,
    domain: 'ahlens.se',
    zipcode: '',
  },
  implementation,
};
