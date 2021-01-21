
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'fressnapf',
    transform: null,
    domain: 'fressnapf.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("div[class='section-content']>div[class='product-overview']>div>div>div>div>div>div>div>div>div")[0];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addHiddenDiv1 (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("div[class='pvsil-title']")[0];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
      try {
        var alternateimg = getAllXpath("(//div[@class='section-content']/div[@class='product-overview']/div/div/div/div/div/div/div/div/div/div/img/@src)", 'nodeValue');
        if (alternateimg != null) {
          if (alternateimg.length > 1) {
            alternateimg.shift();
          }
          for (var i = 0; i < alternateimg.length; i++) {
            addHiddenDiv('abc', alternateimg[i], i);
          }
        }
      } catch (error) {

      }
      try {
        var variant = getAllXpath("(//div[@class='product-variant-selector'])[2]/div/label/span/div/div[@class='pvsil-title']/text()", 'nodeValue');
        if (variant != null && variant.length > 0) {
          var ab = variant.join(' | ');
          addHiddenDiv1('variant', ab, 0);
        }
      } catch (error) {

      }
    });
    await context.extract(productDetails);
  },
};
