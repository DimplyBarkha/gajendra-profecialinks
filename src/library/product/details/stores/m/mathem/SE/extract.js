
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'mathem',
    transform: null,
    domain: 'mathem.se',
    zipcode: '',
  },
  implementation
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
    //for rank
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("span[class='product-name']")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let firstChildNode;
    const aggregateRating = document.querySelectorAll("div[class='full-width'] i[class='fa fa-star']").length
      addHiddenDiv('aggregateRating',aggregateRating ,0);
    // }
  });
  //rank end
  return await context.extract(productDetails, { transform });
}