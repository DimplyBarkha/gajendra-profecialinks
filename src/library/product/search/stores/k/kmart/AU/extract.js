const { transform } = require('../../../../shared');
const implementation = async function (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        scrollTop += 200;
        window.scroll(0, scrollTop);
        await stall(1000);
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      function addHiddenDiv(id, content, index) {
        // @ts-ignore
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="product product_box small-6 medium-4 large-4 columns clearfix col "]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      };
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
  
        }
        return result;
  
      };
      var abc = getAllXpath("//div[@class='product product_box small-6 medium-4 large-4 columns clearfix col ']/@data-attribute-productid", 'nodeValue');
      var pqr;
      if (abc != null) {
          for (var i = 0; i < abc.length; i++) {
            pqr = "P_" + abc[i]
            addHiddenDiv('id', pqr, i);
          }
        }
    });
  };
  await applyScroll(context);

  return await context.extract(productDetails, { transform });
};
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'kmart',
    transform: transform,
    domain: 'kmart.com.au',
    zipcode: '',
  },
  implementation,
};
