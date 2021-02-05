const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'lentillesmoinscheres',
    transform: transform,
    domain: 'lentillesmoinscheres.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv1(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      const originalDiv = document.querySelectorAll('ul[class="products-catalog row"] li div[class="picture"] a img')[index];
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
    var ids = getAllXpath('//ul[@class="products-catalog row"]/li//div[@class="picture"]/a/img/@data-frz-src', 'nodeValue');
    for (var i = 0; i < ids.length; i++) {
      if (ids[i].includes(".jpg")) {
        var abc = ids[i].split(".jpg")[0];
        if (abc.includes("/")) {
          var arr = abc.split("/");
          var id = arr[arr.length - 1];
          if (id.includes("_")) {
            id = id.split("_")[0];
            addHiddenDiv1('id', id, i);
          }
        }
      }
    }
  });
  return await context.extract(productDetails, { transform });
},
}