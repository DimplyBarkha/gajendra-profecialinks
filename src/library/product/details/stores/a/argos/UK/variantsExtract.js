async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    const arr = [];
    try {
      const variantArr = window.__data.productStore.data.variants.attributes.variants;
      variantArr.forEach(item => {
        arr.push(item.partNumber);
      });
    } catch (err) {
      console.log(err);
    }
    if (arr.length === 0) {
      arr.push(window.location.href.replace(/[^\d+]/g, ''));
    }
    if (arr.length) {
      const table = document.createElement('table');
      document.body.appendChild(table);
      const tBody = document.createElement('tbody');
      table.appendChild(tBody);

      for (let index = 0; index < arr.length; index++) {
        const newlink = document.createElement('tr');
        newlink.setAttribute('class', 'append_variant');
        newlink.setAttribute('variant_id', arr[index]);
        tBody.appendChild(newlink);

        const id = document.createElement('td');
        id.setAttribute('class', 'id');
        id.setAttribute('id', arr[index]);
        id.setAttribute('url', `https://www.argos.co.uk/product/${arr[index]}`);
        newlink.appendChild(id);
      }
    }
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'argos',
    transform: null,
    domain: 'argos.co.uk',
    zipcode: 'SE19PD',
  },
  implementation,
};
