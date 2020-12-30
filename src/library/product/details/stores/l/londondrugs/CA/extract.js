// const { transform } = require('../../../../../details/shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addElementToDocument (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };
    // Double Pipe Concatenation
    const pipeSeparatorDouble = (id, data) => {
      var doubleSeparatorText = data.join(' || ');
      addElementToDocument(id, doubleSeparatorText);
    };

    // XPATH Data Extraction For Additional Description Bullet
    const addDescBulletInfo = getAllXpath("//div[@id='pdp-overview']", 'nodeValue');
    pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'londondrugs',
    transform: null,
    domain: 'londondrugs.com',
    zipcode: '',
  },
  implementation,
};
