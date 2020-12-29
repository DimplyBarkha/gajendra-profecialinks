async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }

    const skusElements = document.querySelectorAll('//div[@class="product-highlights-wrapper"]//ul[@class="page-product-options-group list-inline"]//a/@href');
    const skuArr = [];
    skusElements.forEach(element => {
      skuArr.push(element.getAttribute('href').match(/pd\/(.+)\//)[1]);
    });
    if (skuArr.length !== 0) {
      for (let i = 0; i < skuArr.length; i++) {
        const pagePrefixUrl = window.location.href.replace(/pd\/.+\//g, `pd/${skuArr[i]}/`);
        addHiddenDiv('variantUrl', pagePrefixUrl);
      }
    }
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'RO',
    store: 'emag',
    transform: null,
    domain: 'emag.ro',
    zipcode: '',
  },
  implementation,
};
