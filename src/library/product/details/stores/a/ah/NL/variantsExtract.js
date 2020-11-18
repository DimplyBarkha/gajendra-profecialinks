async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    function getElementsByXPath (xpath, parent) {
      const results = [];
      const query = document.evaluate(xpath, parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        const node = query.snapshotItem(i) && query.snapshotItem(i).textContent && query.snapshotItem(i).textContent.trim().replace(/(.+)(wi\d+)(.+)/g, '$2');
        results.push(node);
      }
      return results.filter(e => e);
    }
    const dataArr = getElementsByXPath('//a[contains(@class,"product-recommendations")]//@href');
    if (dataArr.length === 0) {
      const id = window.location.href.replace(/(.+)(wi\d+)(.+)/g, '$2');
      dataArr.push(id);
    }
    if (dataArr.length) {
      const table = document.createElement('table');
      document.body.appendChild(table);
      const tBody = document.createElement('tbody');
      table.appendChild(tBody);

      for (let index = 0; index < dataArr.length; index++) {
        const newlink = document.createElement('tr');
        newlink.setAttribute('class', 'append_variant');
        newlink.setAttribute('variant_id', dataArr[index]);
        tBody.appendChild(newlink);

        const id = document.createElement('td');
        id.setAttribute('class', 'id');
        id.setAttribute('id', dataArr[index]);
        id.setAttribute('url', `https://www.ah.nl/producten/product/${dataArr[index]}`);
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
