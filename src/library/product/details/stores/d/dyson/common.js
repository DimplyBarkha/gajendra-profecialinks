// module.exports.implementation = ({ productPageSelector = defaultproductPageSelector } = {}) =>
async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails, Helpers } = dependencies;
  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
      if (Array.isArray(value)) {
        const innerHTML =
                            value.reduce((acc, val) => {
                              return `${acc}<li>${val}</li>`;
                            }, '<ul>') + '</ul>';
        catElement.innerHTML = innerHTML;
      } else {
        catElement.textContent = value;
      }
    }
    let specs = '';
    document.querySelectorAll('div.spec-set__item>span').forEach((element) => {
      let specLabel = element.querySelector('.spec__label');
      specLabel = specLabel ? specLabel.innerText.trim() : '';
      let specValue = element.querySelector('.spec__data');
      specValue = specValue ? specValue.innerText.trim() : '';
      if (specLabel) {
        specs = specs
          ? `${specs} || ${specLabel}${specValue ? `: ${specValue}` : ''}`
          : `${specLabel}${specValue ? `: ${specValue}` : ''}`;
      }
    });
    addElementToDocument('added_specs', specs);
    if (window.dataLayer) {
      const dataObj = window.dataLayer.find(
        (el) => el.event === 'primaryProduct',
      );
      if (dataObj && dataObj.primaryProduct) {
        addElementToDocument('added_sku', dataObj.primaryProduct.productSKU);
      }
    }
  });
  // first check that the page is a valid product page
  return await context.extract(productDetails, {
    transform: parameters.transform,
  });
}
module.exports = { implementation };
