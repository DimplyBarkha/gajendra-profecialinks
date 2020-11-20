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
      // @ts-ignore
      var price = window.product_price;
      addHiddenDiv('price', '€' + price, 0);
    }
    var description = getAllXpath("//div[@itemprop='description']/text() | //div[@id='descr']/div/p//text() | //div[@id='descr']/div/h2/text() | //div[@id='descr']/div/ul/li/text()", 'nodeValue');
    pipeSeparatorDouble('description', description);
    const addDescBulletInfo = getAllXpath("//div[@id='descr']/div/ul/li/text()", 'nodeValue');
    var finaladdDescBulletInfo = pipeSeparatorDouble2(addDescBulletInfo);
    addHiddenDiv('addDescBulletInfo', '||' + finaladdDescBulletInfo, 0);
  });
  return await context.extract(productDetails, { transform });
}
