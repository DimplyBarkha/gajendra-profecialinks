const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'tigerdirect',
    transform: cleanUp,
    domain: 'tigerdirect.com',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addclass(xpathforpagination) {
      var elems = document.querySelectorAll(xpathforpagination);
      elems[0].classList.add('pagination');
    }
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
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
    // Double Pipe Concatenation
    const pipeSeparatorDouble = (id, data) => {
      // var doubleSeparatorText = data.join(' || ');
      addElementToDocument('id', data);
    };
    const pipeSeparatorDouble1 = (id, data) => {
      // var doubleSeparatorText = data.join(' || ');
      addElementToDocument('zoom', data);
    };
    // XPATH Data Extraction For Additional Description Bullet
    const addDescBulletInfo1 = getAllXpath("//div[@class='leftCol shortDesc']/ul/li/text()", 'nodeValue');
    const addDescBulletInfo2 = getAllXpath("//div[@id='ProductManuals']/ul[@class='pdManuals']/li/a/text()", 'nodeValue');
    var xyz = addDescBulletInfo1.concat(addDescBulletInfo2)
    var lee = xyz.join(" || ");
    var abc = addDescBulletInfo1.join(" || ");
    // addElementToDocument(id, lee);
    pipeSeparatorDouble('addDescBulletInfo', lee);
    pipeSeparatorDouble1('addDescBulletInfo', abc);
  });

  return await context.extract(productDetails, { transform });
}
