
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.de',
    prefix: null,
    url: 'https://www.amazon.de/dp/{id}/ref=sr_1_1?__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&fpw=fresh&keywords={id}&s=amazonfresh&sr=1-1',
    country: 'DE',
    store: 'Freshamazon',
    zipcode: '10243',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  const { domain, prefix, suffix } = parameters;

  if (parameters.url) {
    const url = parameters.url.replace(/{id}/g, encodeURIComponent(id));
    return url;
  }
  let gotoUrl = `https://${domain}`;
  if (prefix) {
    gotoUrl += `/${prefix}`;
  }
  gotoUrl += `/${id}`;
  if (suffix) {
    gotoUrl += `/${suffix}`;
  }
  return gotoUrl;
}