
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  if (parameters.url) {
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    await dependencies.goto({ url });
    return await context.evaluate(async function (id) {
      const response = await fetch(`https://www.joycemayne.com.au/ajaxwishlist/cart/add/product/${id}/isAjax/1/`);
      const json = await response.json();
      return json.url || 'https://www.joycemayne.com.au/catalogsearch/result/?q=errorpage';
    }, id);
  }
}
module.exports = {
  implements: 'product/details/createUrl',
  dependencies: {
    goto: 'action:navigation/goto',
  },
  parameterValues: {
    domain: 'joycemayne.com.au',
    prefix: null,
    url: 'https://www.joycemayne.com.au',
    country: 'AU',
    store: 'joycemayne',
    zipcode: '',
  },
  implementation,
};
