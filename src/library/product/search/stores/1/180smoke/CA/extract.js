async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    const brandName = window.location.href.replace('https://www.180smoke.ca/search?q=', '');
    const manufactureres = document.querySelectorAll('div.manufacturer > div.form-item-content > div.form-check ');
    if (manufactureres) {
      Array.from(manufactureres).forEach(manufacturer => {
        var selectBrand = manufacturer.querySelector('label > div').innerHTML;
        if (String(selectBrand).includes(brandName.toUpperCase())) {
          manufacturer.querySelector('input').click();
        }
      });
    }
  });
  await new Promise(r => setTimeout(r, 500));

  return await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: '180smoke',
    transform: null,
    domain: '180smoke.ca',
    zipcode: '',
  },
  implementation,
};
