
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  await context.evaluate(async function () {
    const variantUrls = document.querySelectorAll('div[class="swatches-group"] > ul > li a');
    function addEleToDoc (key, value) {
      const prodEle = document.createElement('div');
      prodEle.id = key;
      prodEle.textContent = value;
      prodEle.style.display = 'none';
      document.body.appendChild(prodEle);
    }
    if (variantUrls && variantUrls.length) {
      variantUrls.forEach(element => {
        const item = element.getAttribute('data-upc');
        const link = window.location.href.replace(/(.+)variantCode=(.+)/gm, '$1variantCode=');
        if (item) {
          addEleToDoc('unique_product_url', `${link}${item}`);
          addEleToDoc('unique_product_id', item);
        }
      });
    } else {
      const itemID = document.querySelector('div[id="about-product-wrapper"]  ul li[class="selected-Item"] span')
      addEleToDoc('unique_product_url', window.location.href);
      if (itemID) {
        addEleToDoc('unique_product_id', itemID.innerText.trim());
      }
    }
  });

  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    transform: null,
    domain: 'shoppersdrugmart.ca',
    zipcode: '',
  },
  implementation,
};
