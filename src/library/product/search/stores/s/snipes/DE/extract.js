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
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="b-rating-value"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      // var getXpath = (xpath, prop) => {
      //   var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      //   let result;
      //   if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      //   else result = elem ? elem.singleNodeValue : '';
      //   return result && result.trim ? result.trim() : result;
      // };
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
        // @ts-ignore
        document.querySelector('button[class="f-button f-button--primary f-button--big js-localization-submit b-localization-submit-button"]').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 6000));
      } catch (error) {

      }

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
    await context.extract(productDetails);
  },
};
