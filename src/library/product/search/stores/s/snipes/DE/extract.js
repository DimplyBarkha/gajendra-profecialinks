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

    async function getProductsCount (context) {
      return context.evaluate(async function () {
        const products = document.evaluate("//a[@class='b-product-tile-image-link js-product-tile-link']/picture/img/@data-src", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return products.snapshotLength;
      });
    }

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
        document.querySelector('span[class="i-close-circle"]').click();
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

    let productsCount = 0;
    while (productsCount < 150) {
      const doesLoadMoreExists = await context.evaluate(function () {
        return Boolean(document.querySelector('a[class="f-button f-button--primary js-show-more-products"]'));
      });

      if (doesLoadMoreExists) {
        await context.evaluate(async function () {
          console.log('Clicking on load more button');
          document.querySelector('a[class="f-button f-button--primary js-show-more-products"]').click();
          await new Promise((resolve, reject) => setTimeout(resolve, 10000));
        });
        productsCount = await getProductsCount(context);
        console.log('productsCount' + productsCount);
        if (productsCount >= 150) {
          break;
        }
        await applyScroll(context);
      } else {
        break;
      }
    }
    return await context.extract(productDetails, { transform });
  },
};
