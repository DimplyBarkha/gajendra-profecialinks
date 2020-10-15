const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function (inputs) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    // @ts-ignore
    const category=window.universal_variable.product.category
    // @ts-ignore
    const subcategory=window.universal_variable.product.subcategory
    const totalCategory=[]
    const totalSubCategory=[]
    totalCategory.push(category)
    totalSubCategory.push(subcategory)
    addHiddenDiv('detail-category', totalCategory);
    addHiddenDiv('detail-category', totalSubCategory);
    });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'littlewoods',
    transform: transform,
    domain: 'littlewoods.com',
  },
  implementation,
};
