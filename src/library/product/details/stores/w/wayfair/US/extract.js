const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(5000);
        break;
      }
    }
    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    const url = window.location.href;
    if (url.includes('piid') || url.includes('redir')) {
      document.body.setAttribute('variantid', url.replace(new RegExp('(.+)(piid=|redir=)(.+)', 'g'), '$3'));
    } else {
      const skuId = document.querySelector('[property="og:upc"]') ? document.querySelector('[property="og:upc"]').getAttribute('content') : '';
      document.body.setAttribute('variantid', skuId);
    }
    const val = [];
    try {
      const data = window.WEBPACK_ENTRY_DATA.application.props.optionComboToPartId;
      for (const i in data) {
        val.push(i);
      }
      await stall(2000);
    } catch (err) {
      console.log({ err });
    }
    if (val.length === 0) {
      const values = document.querySelectorAll('div.VisualOptionCard > div > div > label > input');
      values.forEach(item => {
        val.push(item.getAttribute('value'));
        item.setAttribute('url', window.location.href.replace(/[^htm]+$/g, `l?piid=${item.getAttribute('value')}`));
      });
    }
    const table = document.createElement('table');
    document.body.appendChild(table);
    const tBody = document.createElement('tbody');
    table.appendChild(tBody);
    for (let index = 0; index < val.length; index++) {
      const newlink = document.createElement('tr');
      newlink.setAttribute('class', 'append_variant');
      newlink.setAttribute('variant_id', val[index].replace(/-/g, '_'));
      tBody.appendChild(newlink);

      const id = document.createElement('td');
      id.setAttribute('class', 'id');
      id.setAttribute('id', val[index].replace(/-/g, '_'));
      id.setAttribute('url', window.location.href.replace(/[^htm]+$/g, `l?piid=${val[index].replace(/-/g, '_')}`));
      newlink.appendChild(id);
    }
    await stall(3000);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    transform,
    domain: 'wayfair.com',
  },
  implementation,
};
