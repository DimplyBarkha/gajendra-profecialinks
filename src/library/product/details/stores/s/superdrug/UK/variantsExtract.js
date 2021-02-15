
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    transform: null,
    domain: 'superdrug.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { variants } = dependencies;

    await context.evaluate(() => {
    // @ts-ignore
      const variants = [...document.querySelectorAll('form#addToCartForm div a')];
      function createElement (id, text) {
        const div = document.createElement('div');
        div.id = id;
        div.innerText = text;
        document.body.appendChild(div);
      }
      let href;
      let id;
      if (variants.length) {
        variants.forEach(item => {
          href = item.getAttribute('href');
          href = href.includes('https') ? href : 'https://www.superdrug.com' + href;
          id = href.split('/');
          id = id[id.length - 1];
          id = id.split('?')[0];
          createElement('variant-id', id);
          createElement('variant-url', href);
        });
      } else {
        href = window.location.href;
        id = href.split('/');
        id = id[id.length - 1];
        id = id.split('?')[0];
        createElement('variant-id', id);
        createElement('variant-url', href);
      }
    });

    return await context.extract(variants, { transform });
  },
};
