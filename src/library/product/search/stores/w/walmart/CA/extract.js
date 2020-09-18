
const { transform } = require('../../../../shared');
/**
 *
 * @param { { } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  // @ts-ignore
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 8000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
    function addHiddenDiv (id, content, productid) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      if (productid) {
        let originalDiv;
        const nodes = document.querySelectorAll("[data-automation*='product-results'] [data-automation*='product']");
        for (let i = 0; i < nodes.length; i++) {
          // console.log("Node::", nodes[i].getAttribute('data-product-id'));
          // eslint-disable-next-line eqeqeq
          if (nodes[i].getAttribute('data-product-id') == productid) {
            console.log('Adding UPC :: ', nodes[i].getAttribute('data-product-id'));
            originalDiv = nodes[i];
            originalDiv && originalDiv.appendChild(newDiv);
            break;
          }
        }
      } else {
        document.body.appendChild(newDiv);
      }
    }
    const searchUrl = window.location.href.replace(/%20/g, ' ');
    addHiddenDiv('search-url', searchUrl);
    // @ts-ignore
    // eslint-disable-next-line prefer-const
    let mainDataObj = window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.results && window.__PRELOADED_STATE__.results.entities && window.__PRELOADED_STATE__.results.entities.products ? window.__PRELOADED_STATE__.results.entities.products : {};
    // console.log(1, mainDataObj);
    // @ts-ignore
    const ids = Object.keys(mainDataObj);
    // console.log(2, ids);
    for (let i = 0; i < ids.length; i++) {
      const skus = mainDataObj[ids[i]] && mainDataObj[ids[i]].skus ? Object.keys(mainDataObj[ids[i]].skus) : [];
      // console.log(3, skus);
      const facet = skus && skus[0] && mainDataObj[ids[i]].skus[skus[0]].facets ? mainDataObj[ids[i]].skus[skus[0]].facets : [];
      // console.log(4, facet);
      for (let j = 0; j < facet.length; j++) {
        const obj = mainDataObj[ids[i]].skus[skus[0]].facets[j];
        // console.log(5, obj);
        // @ts-ignore
        if (obj && obj.name && obj.name.includes('UPC')) {
          addHiddenDiv('ii_upc', obj.value, ids[i]);
          // console.log('6, Added', obj.value, ids[i]);
        }
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    transform,
    domain: 'walmart.ca',
    zipcode: '',
  },
  implementation,
};
