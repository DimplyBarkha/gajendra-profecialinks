
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    const values = document.querySelectorAll('div.VisualOptionCard > div > div > label > input');
    values.forEach(item => {
      item.setAttribute('url', window.location.href.replace(/[^htm]+$/g, `l?piid=${item.getAttribute('value')}`));
    });
    if (!document.querySelector('div.VisualOptionCard > div > div > label > input')) {
      var URL = document.querySelector('[property="og:url"]') ? document.querySelector('[property="og:url"]').getAttribute('content') : '';
      var id = URL.replace(new RegExp('(.+)(keyword=|piid=|redir=)(.+)', 'g'), '$3');
      var altId = document.querySelector('#form-add-to-cart > div > div > div > div > input[type=hidden]');
      var skuId = document.querySelector('[property="og:upc"]') ? document.querySelector('[property="og:upc"]').getAttribute('content') : '';
      if (altId) {
        document.body.setAttribute('variantid', altId.getAttribute('value'));
      } else if (skuId) {
        document.body.setAttribute('variantid', skuId);
      } else if (id) {
        document.body.setAttribute('variantid', id);
      }
      document.body.setAttribute('url', URL);
    }
  }, createUrl);
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    transform: null,
    domain: 'wayfair.com',
    zipcode: '',
  },
  implementation,
};
