const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'lensonline.nl',
    transform: cleanUp,
    domain: 'lensonline.nl',
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
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("div[class='row MB40 details-top-flexing']")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    // Double Pipe Concatenation
    const pipeSeparatorDouble = (id, data) => {
      var doubleSeparatorText = data.join(' || ');
      addHiddenDiv(id, doubleSeparatorText, 0);
    };
    // Single Pipe Concatenation
    const pipeSeparatorSingle = (id, data) => {
      var doubleSeparatorText = data.join(' | ');
      addHiddenDiv(id, doubleSeparatorText, 0);
    };
    const pipeSeparatorDouble2 = (data) => {
      var doubleSeparatorText = data.join(' || ');
      return doubleSeparatorText;
    };
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
    var firstPrice = getAllXpath("(//div[contains(@class,'price_badge__price')]/text())[1]", 'nodeValue');
    var secondPrice = getAllXpath("//div[contains(@class,'price_badge__price')]/sup/text()", 'nodeValue');
    try {
      secondPrice = secondPrice[0].replace(",", ".");
      addHiddenDiv('price', firstPrice[0] + secondPrice, 0);
    } catch (error) {

    }
    var description = getAllXpath("//div[@itemprop='description']/text() | //div[@id='descr']/div/p//text() | //div[@id='descr']/div/h2/text() | //div[@id='descr']/div/ul/li/text()", 'nodeValue');
    var finalDescription = [];
    for (let p = 0; p < description.length; p++) {
      if (description[p].trim().length > 2) {
        finalDescription.push(description[p]);
      }
    }
    pipeSeparatorSingle('description', finalDescription);

    var specifications = [];
    const rawSpecifications = document.querySelectorAll('table[class="product_attributes"]>tbody>tr');
    for (let p = 0; p < rawSpecifications.length; p++) {
      // @ts-ignore
      specifications.push(rawSpecifications[p].innerText);
    }
    pipeSeparatorDouble('specifications', specifications);

    const addDescBulletInfo = getAllXpath("//div[@id='descr']/div/ul/li/text()", 'nodeValue');
    var finaladdDescription = [];
    for (let p = 0; p < addDescBulletInfo.length; p++) {
      if (addDescBulletInfo[p].trim().length > 2) {
        finaladdDescription.push(addDescBulletInfo[p]);
      }
    }
    var finaladdDescBulletInfo = pipeSeparatorDouble2(finaladdDescription);
    addHiddenDiv('addDescBulletInfo', '||' + finaladdDescBulletInfo, 0);
  });
  return await context.extract(productDetails, { transform });
}
