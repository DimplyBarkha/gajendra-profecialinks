async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    document.querySelectorAll('div[data-section="gridview"]>div[data-component="productpod"]').forEach(node => {
      const noOfResultPerPage = +node.getAttribute('data-podpageresultscount');
      const prevPage = +node.getAttribute('data-pagenumber') - 1;
      const nodePos = +node.getAttribute('data-pos') + 1;
      let rank;
      if (prevPage >= 1) {
        rank = prevPage * noOfResultPerPage + nodePos;
      } else {
        rank = nodePos;
      }
      const newDiv = document.createElement('span');
      newDiv.className = 'rank_org';
      newDiv.textContent = rank.toString();
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    });
  });
  return await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    transform: null,
    domain: 'homedepot.com',
  },
  implementation,
};
