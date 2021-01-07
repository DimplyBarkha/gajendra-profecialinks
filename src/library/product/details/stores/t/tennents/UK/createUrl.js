
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'new.tennentsdirect.com',
    prefix: null,
    url: null,
    country: 'UK',
    store: 'tennents',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { url, id } = inputs;
    const { domain } = parameters;
    let gotoUrl = '';
    if (url) {
      const productId = url.match(/=(.+)/) ? url.match(/=(.+)/)[1] : '';
      gotoUrl = productId ? `https://${domain}/products/kw/${productId}` : url;
    } else if (id) {
      gotoUrl = `https://${domain}/products/kw/${id}`;
    } else throw new Error('No id or url provided');

    return gotoUrl;
  },
};
