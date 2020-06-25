const { transform } = require('../transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  // await context.evaluate(() => {
  //   function addHiddenDiv (id, content, productDivRef) {
  //     const newDiv = document.createElement('div');
  //     newDiv.id = id;
  //     newDiv.textContent = content;
  //     newDiv.style.display = 'none';
  //     productDivRef.parentNode.insertBefore(newDiv, productDivRef);
  //   }
  //   const product = document.querySelectorAll('section[class*="products-grid"] article figure');
  //   const rankSelector = document.querySelector('div[id="pagination"] li[class="current"]');
  //   // @ts-ignore
  //   let rank = rankSelector ? Number(rankSelector.innerText) : 0;
  //   if (rank) rank = (rank - 1) * 60 + 1;
  //   for (let i = 0; i < product.length; i++) {
  //     addHiddenDiv(`ii_rankOrganic_${rank}`, rank++, product[i]);
  //   }
  // });
  return await context.extract(productDetails, { transform: parameters.transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    transform,
    domain: 'feelunique.com',
  },
  implementation,
};
