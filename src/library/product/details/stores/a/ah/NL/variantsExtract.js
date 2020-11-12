async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    function getListOfElementsByXPath (xpath) {
      const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      return result;
    }
    const arr = [];
    const results = getListOfElementsByXPath("//a[contains(@class,'product-recommendations')]//@href");
    while (node = results.iterateNext()) {
      arr.push(node.value.replace(/(.+)(wi\d+)(.+)/g, '$2'));
    }
    if (arr.length === 0) {
      const id = window.location.href.replace(/(.+)(wi\d+)(.+)/g, '$2');
      arr.push(id);
    }
    console.log(arr);
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
        id.setAttribute('url', `https://www.ah.nl/producten/product/${arr[index]}`);
        newlink.appendChild(id);
      }
    }
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'NL',
    store: 'ah',
    transform: null,
    domain: 'ah.nl',
    zipcode: '',
  },
  implementation,
};
