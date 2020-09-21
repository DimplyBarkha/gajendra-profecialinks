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
    let loadMore = document.querySelector('div.ais-InfiniteHits > button');
    while(loadMore && loadMore.getAttribute('disabled') !== "disabled"){
      await loadMore.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 10000));
      loadMore = document.querySelector('div.ais-InfiniteHits > button');
    }
  });

  try {
    await context.evaluate(async () => {
      function addHiddenDiv (id, content, parent) {
        const newDiv = document.createElement('div');
        newDiv.className = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        parent.appendChild(newDiv);
      }
  
      let recordSelector = document.querySelectorAll('li.ais-InfiniteHits-item');
      
      for (const record of recordSelector) {
        if(record && record.childNodes && record.childNodes[0] && record.childNodes[0].getAttribute('href')) {
          let productIdentifierText = record.childNodes[0].getAttribute('href').split('/')[2].split('.')[0];
          const productInfo = await fetch(`https://www.adorebeauty.com.au/api/product?identifier=${productIdentifierText}&locale=en-AU`).then(res => res.json());
          if(productInfo && productInfo.id) {
            addHiddenDiv("myProductId", productInfo.id.split('_')[0], record);
            addHiddenDiv("myReviewTotal", productInfo.reviewTotal, record);
          }
        }
      }
    });
  }catch(e){
    console.log(e);
  }

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
