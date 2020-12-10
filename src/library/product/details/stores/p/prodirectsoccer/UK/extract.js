
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'prodirectsoccer',
    transform: null,
    domain: 'prodirectsoccer.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    let popup = await context.evaluate(()=>{
      return Boolean(document.querySelector(".taxfree-popup"))
    })
    if (popup){
      await context.click(".taxfree-popup button");
    }
    await context.evaluate(() => {
      const productUrl = window.location.href;
      const variantId = productUrl.split('variant=')[1];
      const selectedVariant = document.querySelector('button[data-variant-id="' + variantId + '"][data-value*="UK"]');
      const sizeLen = selectedVariant.getAttribute('aria-label');
      let size = '';
      if (sizeLen.length === 2) {
        size = sizeLen[1];
      }
      document.querySelector('body').setAttribute('size', size);
      const availability = selectedVariant.getAttribute('class').match('out-stock');
      if (availability) {
        document.querySelector('body').setAttribute('availability', 'Out of Stock');
      } else {
        document.querySelector('body').setAttribute('availability', 'In Stock');
      }
      const url = window.location.href;
      const sku = url.replace(/(.+p\/)(\d+)(.+)/, '$2');
      document.querySelector('body').setAttribute('rpc',sku + variantId);
      // @ts-ignore
      let name = document.querySelector('section[class=container-inner] li:nth-child(2) > a').innerText;
      let nameExt = name + size;
      document.querySelector('body').setAttribute('name-extended', nameExt);
    });

    return await context.extract(productDetails, { transform });
  },
};

