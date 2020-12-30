async function implementation (
  inputs,
  parameters,
  context,
) {
  let { id } = inputs;
  id = id.toString();
  if (id.length < 6) {
    id = '0' + id;
  }
  await context.goto('https://www.douglas.at');
  const url = await context.evaluate(async (id) => {
    const res = await fetch(`https://www.douglas.at/api/v2/products/${id}`);
    const data = await res.json();
    const url = 'https://www.douglas.at' + data.url;
    return url;
  }, id);
  return url;
}

module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'douglas.at',
    prefix: null,
    url: null,
    store: 'douglas',
    country: 'AT',
    zipcode: '',
  },
  implementation,
};
