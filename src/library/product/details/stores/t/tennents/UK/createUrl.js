
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
    const { url } = inputs;
    const { domain } = parameters;
    if (!url) throw new Error('No id provided');
    const productId = url.match(/=(.+)/) ? url.match(/=(.+)/)[1] : '';
    const gotoUrl = productId ? `https://${domain}/products/kw/${productId}` : url;

    return gotoUrl;
  },
};
