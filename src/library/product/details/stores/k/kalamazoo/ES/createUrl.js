
async function implementation (
  inputs,
  parameters,
) {
  let { id } = inputs;
  id = id.toString().replace(/[a-zA-Z]+-/g, '');
  console.log('Id from my createUrl file: ' + id);
  if (parameters.url) {
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    return url;
  }
}

module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'kalamazoo.es',
    prefix: null,
    url: 'https://www.kalamazoo.es/_sku{id}.html',
    store: 'kalamazoo',
    country: 'ES',
    zipcode: '',
  },
  implementation,
};
