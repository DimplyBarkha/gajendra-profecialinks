const { cleanUp } = require('../../../../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    while (!!document.querySelector('#ahl-product-list-app > div > div >button')) {
      document.querySelector('#ahl-product-list-app > div > div >button').click()
      await new Promise(r => setTimeout(r, 6000));
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
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
      const sliceURL1 = (data) => {
        for (let index = 0; index < data.length; index++) {
          if (data[index].includes(",")) {
            var temp = data[index].replace(",", ".");
          } else {
            temp = data[index].replace(" ", " ");
          }
          addElementToDocument('altImage2', temp);
        }
      };
      var backgroundURL1 = getAllXpath("//*[contains(@class,'MuiCardContent-root')]//div/div//span[1]/text()", 'nodeValue');
      sliceURL1(backgroundURL1);
      const sliceURL = (data) => {
        var cnt = 0;
        for (let index = 0; index < data.length; index++) {
          if (data[0] != 0) {
            cnt++;
            addElementToDocument('altImages1', cnt);
          }
        }
      };
      var backgroundURL = getAllXpath("//*[contains(@class,'MuiButtonBase-root MuiCardActionArea')]", 'nodeValue');
      sliceURL(backgroundURL);
    }
  })
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform: cleanUp,
    domain: 'ahlens.se',
    zipcode: '',
  },
  implementation,
};
