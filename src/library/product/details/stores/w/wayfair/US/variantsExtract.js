
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    await stall(1000);
    const values = document.querySelectorAll('div.VisualOptionCard > div > div > label > input');
    values.forEach(item => {
      item.setAttribute('url', window.location.href.replace(/[^htm]+$/g, `l?piid=${item.getAttribute('value')}`));
    });
    if (!document.querySelector('div.VisualOptionCard > div > div > label > input')) {
      const val = [];
      try {
        const data = window.WEBPACK_ENTRY_DATA.application.props.optionComboToPartId;
        await stall(5000);
        for (const i in data) {
          val.push(i);
        }
        // if (val.length === 0) {
        //   // const skuId = document.querySelector("#form-add-to-cart > input[type=hidden]:nth-child(1)").getAttribute('value');
        //   const sku = window.WEBPACK_ENTRY_DATA.application.props.sku;
        //   val.push(sku);
        // }
      } catch (err) {
        console.log({ err });
      }
      await new Promise(resolve => setTimeout(resolve, 30000));
      const table = document.createElement('table');
      document.body.appendChild(table);
      const tBody = document.createElement('tbody');
      table.appendChild(tBody);
      for (let index = 0; index < val.length; index++) {
        const newlink = document.createElement('tr');
        newlink.setAttribute('class', 'append_variant');
        newlink.setAttribute('variant_id', val[index]);
        tBody.appendChild(newlink);

        const id = document.createElement('td');
        id.setAttribute('class', 'id');
        id.setAttribute('id', val[index]);
        id.setAttribute('url', window.location.href.replace(/[^htm]+$/g, `l?piid=${val[index]}`));
        newlink.appendChild(id);
      }
      if (val.length === 0) {
        const url = document.querySelector('[property="og:url"]') ? document.querySelector('[property="og:url"]').getAttribute('content') : '';
        // if (url.includes('piid') || url.includes('redir')) {
        //   document.body.setAttribute('variantid', url.replace(new RegExp('(.+)(piid=|redir=)(.+)', 'g'), '$3'));
        //   document.body.setAttribute('url', url);
        // } else {
        const skuId = document.querySelector('[property="og:upc"]') ? document.querySelector('[property="og:upc"]').getAttribute('content') : '';
        document.body.setAttribute('variantid', skuId);
        document.body.setAttribute('url', url);
        // }
      }
    }
    // if (!document.querySelector('div.VisualOptionCard > div > div > label > input')) {
    //   var URL = document.querySelector('[property="og:url"]') ? document.querySelector('[property="og:url"]').getAttribute('content') : '';
    //   var id = URL.replace(new RegExp('(.+)(keyword=|piid=|redir=)(.+)', 'g'), '$3');
    //   var altId = document.querySelector('#form-add-to-cart > div > div > div > div > input[type=hidden]');
    //   var skuId = document.querySelector('[property="og:upc"]') ? document.querySelector('[property="og:upc"]').getAttribute('content') : '';
    //   if (altId) {
    //     document.body.setAttribute('variantid', altId.getAttribute('value'));
    //   } else if (skuId) {
    //     document.body.setAttribute('variantid', skuId);
    //   } else if (id) {
    //     document.body.setAttribute('variantid', id);
    //   }
    //   document.body.setAttribute('url', URL);
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
