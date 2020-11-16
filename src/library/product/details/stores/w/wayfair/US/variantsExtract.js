
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    const val = [];
    const values = document.querySelectorAll('div.VisualOptionCard > div > div > label > input');
    values.forEach(item => {
      val.push(item.getAttribute('value'));
      item.setAttribute('url', window.location.href.replace(/[^htm]+$/g, `l?piid=${item.getAttribute('value')}`));
    });
    // if (!document.querySelector('div.VisualOptionCard > div > div > label > input')) {
    try {
      const data = window.WEBPACK_ENTRY_DATA.application.props.optionComboToPartId;
      for (const i in data) {
        val.push(i);
      }
      await stall(2000);
      if (val.length === 0) {
        // const skuId = document.querySelector("#form-add-to-cart > input[type=hidden]:nth-child(1)").getAttribute('value');
        const sku = window.WEBPACK_ENTRY_DATA.application.props.sku;
        val.push(sku);
      }
    } catch (err) {
      console.log({ err });
    }
    // }
    if (val.length === 0) {
      var URL = document.querySelector('[property="og:url"]') ? document.querySelector('[property="og:url"]').getAttribute('content') : '';
      var id = URL.replace(new RegExp('(.+)(keyword=|piid=|redir=)(.+)', 'g'), '$3');
      // var altId = document.querySelector('#form-add-to-cart > div > div > div > div > input[type=hidden]');
      var skuId = document.querySelector('[property="og:upc"]') ? document.querySelector('[property="og:upc"]').getAttribute('content') : '';
      const description = document.createElement('div');
      description.id = 'variant';
      // if (altId) {
      //   val.push(altId);
      //   description.setAttribute('variantid', altId);
      // } else
      if (skuId) {
        val.push(skuId);
        description.setAttribute('variantid', skuId);
      } else if (id) {
        val.push(id);
        description.setAttribute('variantid', id);
      }
      description.setAttribute('url', URL);
      document.body.appendChild(description);
    }
    // await new Promise(resolve => setTimeout(resolve, 20000));
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
    // if (val.length === 0) {
    //   const url = document.querySelector('[property="og:url"]') ? document.querySelector('[property="og:url"]').getAttribute('content') : '';
    //   // if (url.includes('piid') || url.includes('redir')) {
    //   //   document.body.setAttribute('variantid', url.replace(new RegExp('(.+)(piid=|redir=)(.+)', 'g'), '$3'));
    //   //   document.body.setAttribute('url', url);
    //   // } else {
    //   const skuId = document.querySelector('[property="og:upc"]') ? document.querySelector('[property="og:upc"]').getAttribute('content') : '';
    //   const description = document.createElement('div');
    //   description.id = 'variant';
    //   description.setAttribute('variantid', skuId);
    //   description.setAttribute('url', url);
    //   document.body.appendChild(description);

    //   // document.body.setAttribute('variantid', skuId);
    //   // document.body.setAttribute('url', url);
    //   // }
    // }
    // }
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
