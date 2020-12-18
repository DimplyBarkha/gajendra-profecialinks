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
    try {
      // @ts-ignore
      var description = document.querySelector('div[id="descr"]').innerText;
      description = description.replace('Omschrijving', '');
      addHiddenDiv('description', description, 0);
    } catch (error) {

    }

    try {
      var specifications = [];
      const rawSpecifications = document.querySelectorAll('table[class="product_attributes"]>tbody>tr');
      for (let p = 0; p < rawSpecifications.length; p++) {
        // @ts-ignore
        specifications.push(rawSpecifications[p].innerText);
      }
      pipeSeparatorDouble('specifications', specifications);
    } catch (error) {

    }


    const addDescBulletInfo = getAllXpath("//div[@id='descr']/div/ul/li/text()", 'nodeValue');
    var finaladdDescription = [];
    for (let p = 0; p < addDescBulletInfo.length; p++) {
      if (addDescBulletInfo[p].trim().length > 2) {
        finaladdDescription.push(addDescBulletInfo[p]);
      }
    }
    var finaladdDescBulletInfo = pipeSeparatorDouble2(finaladdDescription);
    addHiddenDiv('addDescBulletInfo', '||' + finaladdDescBulletInfo, 0);
    try {
      // @ts-ignore
      let servingPackage = document.querySelector('h1[class="product_name"] span').innerText;
      servingPackage = servingPackage.replace('ml', '');
      servingPackage = servingPackage.replace('lenzen', '');
      addHiddenDiv('servingPackage', servingPackage, 0);
    } catch (error) {

    }
  });
  return await context.extract(productDetails, { transform });
}
