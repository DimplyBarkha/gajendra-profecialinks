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
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await stall(1000);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  await context.evaluate(async function () {
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("div[class='grid']>div>a")[index];
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
    var data = getAllXpath("//div[@class='grid']/div/a/@href", 'nodeValue');
    for (var i = 0; i < data.length; i++) {
      if (data[i].includes('-')) {
        var zz = data[i].split('-');
        var id = zz[zz.length - 1];
        id = id.slice(0, -1);
        addHiddenDiv('RPC', id, i);
      }
    }
  });
  return await context.extract(productDetails, { transform });
};
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'fressnapf',
    transform: transform,
    domain: 'fressnapf.de',
    zipcode: '',
  },
  implementation,
};
