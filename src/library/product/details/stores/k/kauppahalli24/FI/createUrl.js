
/**
 *
 * @param { { id: any } } inputs
 * @param { { domain: string, prefix?: string, suffix?: string, url?: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  const response = await context.evaluate(async (id) => {
    return await fetch(`https://kauppahalli24_fi_api.frosmo.com/?queries=%5B%22${id}%22%5D&method=getProductsBySku`).then(response => response.json())
      .then(data => data)
      .catch(error => console.error('Error:', error));
  }, id);
  if (response && response.data[0] && response.data[0].products[0] && response.data[0].products[0].id) {
    return `https://www.kauppahalli24.fi/tuotteet/?id=${id}#/pid/${response.data[0].products[0].id}`;
  } else {
    return `https://www.kauppahalli24.fi/tuotteet/?id=${id}&s=#pid/${id}`;
  }
}
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'kauppahalli24.fi',
    prefix: null,
    url: null,
    country: 'FI',
    store: 'kauppahalli24',
    zipcode: '',
  },
  implementation,
};
