async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }
    const aggregateRating = document.querySelectorAll('.rating');
    for (let k = 0; k < aggregateRating.length; k++) {
      // @ts-ignore
      let singleRating = aggregateRating[k].style.width;
      singleRating = singleRating.slice(0, singleRating.length - 1);
      singleRating = (5 * singleRating) / 100;
      singleRating = singleRating.toFixed(1);
      addHiddenDiv(aggregateRating[k], 'aggregateRating', singleRating);
    }
    const itemContainers = document.querySelectorAll('#lb-results > div > div > ul > li');
    let rank = 1;
    // @ts-ignore
    for (const itemContainer of itemContainers) {
      console.log(itemContainer);
      const totalRank = itemContainer + rank;
      addHiddenDiv(itemContainer, 'rank', totalRank);
      rank++;
    }
  });
  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SK',
    store: 'nay',
    transform: null,
    domain: 'nay.sk',
    zipcode: '',
  },
  implementation,
};
