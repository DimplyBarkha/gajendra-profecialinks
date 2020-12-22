
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const isVariant = document.querySelectorAll('div[class*="hidden"] a');
    if (isVariant.length) {
      isVariant.forEach(element => {
        // @ts-ignore
        element && element.href && addHiddenDiv('pd_variant_url', element.href);
        // @ts-ignore
        element && element.href && addHiddenDiv('pd_variant_id', element.href.replace(/(.+)\/s*(.+)/g, '$2'));
      });
    } else {
      const singleUrl = document.querySelector('link[rel="canonical"]');
      if (singleUrl) {
        // @ts-ignore
        addHiddenDiv('pd_variant_url', singleUrl.href);
        // @ts-ignore
        addHiddenDiv('pd_variant_id', singleUrl.href.replace(/(.+)\/s*(.+)/g, '$2'));
      }
    }
  });
  return await context.extract(variants, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'crateandbarrel',
    transform: null,
    domain: 'crateandbarrel.com',
    zipcode: '',
  },
  implementation,
};
