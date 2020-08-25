const { transform } = require('../format');

/**
 *
 * @param { { } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  
  await context.evaluate(async () => {
    let loadMore = document.querySelector('button[class="flex items-center mx-auto text-center uppercase text-white bg-black my-4 px-4 py-3 rounded-sm"]');
    while(loadMore && loadMore.getAttribute('disabled') !== "disabled"){
      await loadMore.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 10000));
      loadMore = document.querySelector('button[class="flex items-center mx-auto text-center uppercase text-white bg-black my-4 px-4 py-3 rounded-sm"]');
    }
  });

  await context.evaluate(async () => {

    function addHiddenDiv (id, content, parent) {
      const newDiv = document.createElement('div');
      newDiv.className = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      parent.appendChild(newDiv);
    }

    let recordSelector = document.querySelectorAll('li[class="ais-InfiniteHits-item m-2"]');
    
    for (const record of recordSelector) {
      let btnView = record.querySelector('button.text-black');
      btnView.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 5000));
      let productId = document.querySelector("meta[itemprop='productID']").content;
      let modalClose = document.querySelector('div[class="dialog__close"]');
      await modalClose.click();
      addHiddenDiv("myProductId", productId, record);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'adorebeauty',
    transform,
    domain: 'adorebeauty.com.au',
    zipcode: '',
  },
  implementation
};
