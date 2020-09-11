async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  await context.evaluate(async function () {
    const productKey = window.location.href.replace(/(.*)--p(\d+)/gm, '$2');
    // @ts-ignore
    const variant = JSON.parse(document.querySelector('script#INITIAL_STATE').innerText.trim()).products[productKey];
    let variantUrls = [];
    if (variant && variant.productVariants) {
      variantUrls = variant.productVariants[0].options;
    }
    function addEleToDoc (key, value) {
      const prodEle = document.createElement('div');
      prodEle.id = key;
      prodEle.textContent = value;
      prodEle.style.display = 'none';
      document.body.appendChild(prodEle);
    }
    if (variantUrls && variantUrls.length) {
      variantUrls.forEach(element => {
        const item = element.product.code;
        const link = window.location.href.replace(/(.*)--p(\d+)/gm, '$1--p');
        if (item) {
          addEleToDoc('unique_product_url', `${link}${item}`);
          addEleToDoc('unique_product_id', item);
        }
      });
    } else {
      addEleToDoc('unique_product_url', window.location.href);
      const Id = window.location.href.replace(/(.*)--p(\d+)/gm, '$2');
      addEleToDoc('unique_product_id', Id);
    }
  });

  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    transform: null,
    domain: 'microspot.ch',
    zipcode: '',
  },
  implementation,
};
