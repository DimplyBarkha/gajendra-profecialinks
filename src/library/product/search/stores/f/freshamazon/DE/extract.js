const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    transform: transform,
    domain: 'freshamazon.de',
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
    const url = window.location.href;
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class*="a-section aok-relative"]')[index];
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
    var desc1 = getAllXpath('//span[@class="a-price-whole"]/text()', 'nodeValue');
    var desc2 = getAllXpath('//span[@class="a-price-symbol"]/text()', 'nodeValue');

    if (desc1 != null) {
      for (var i = 0; i < desc1.length; i++) {
        desc1[i] = desc1[i].replace(",", ".");
        desc1[i] = desc1[i] + " " + desc2[i]
        addHiddenDiv('price', desc1[i], i);
      }
    }

    var temp, aggregate;
    const products = document.querySelectorAll('div[class="sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 sg-col sg-col-4-of-20"]');
    for (let i = 0; i < products.length; i++) {
      temp = products[i].querySelector('a span[class="a-size-base"]');
      aggregate = products[i].querySelector('a[class="a-popover-trigger a-declarative"] i span');
      if (temp != null) {
        // @ts-ignore
        temp = temp.innerText;
        temp = temp.replace('.', ',');
        addHiddenDiv('rating', temp, i);
      }
      if (aggregate != null) {
        // @ts-ignore
        aggregate = aggregate.innerText.split(' ')[0].replace(',', '.');
        addHiddenDiv('aggregate', aggregate, i);
      }
      addHiddenDiv('added-searchurl', url, i);
    }
  });
  return await context.extract(productDetails, { transform });
};


