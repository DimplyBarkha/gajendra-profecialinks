async function implementation (
  inputs,
  parameters,
) {
  let { id } = inputs;
  id = id.toString();
  if (id.length < 6) {
    id = '0' + id;
  }
  if (parameters.url) {
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    return url;
  }
}

module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'douglas.at',
    prefix: null,
    url: 'https://www.douglas.at/de/p/{id}',
    store: 'douglas',
    country: 'AT',
    zipcode: '',
  },
  implementation,
};
