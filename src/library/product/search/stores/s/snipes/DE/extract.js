const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'snipes',
    transform: transform,
    domain: 'snipes.com',
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
      try {
        // @ts-ignore
        document.querySelector('span[class="i-close-thin"]').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 6000));
      } catch (error) {
      }
      try {
        // @ts-ignore
        document.querySelector('span[class="i-close-thin"]').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 6000));
      } catch (error) {
      }
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="b-rating-value"]')[index];
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
      // aggregateRating
      var str = getAllXpath('//div[@class="b-rating-value"]/@style', 'nodeValue');
      if (str != null) {
        for (var i = 0; i < str.length; i++) {
          var abc = str[i].split(': ')[1];
          abc = abc.slice(0, -1);
          abc = (abc) / 20;
          addHiddenDiv('agg', abc, i);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
