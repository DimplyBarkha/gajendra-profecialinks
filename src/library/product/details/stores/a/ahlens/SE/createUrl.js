
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'ahlens.se',
    prefix: null,
    url: 'https://www.ahlens.se/INTERSHOP/web/WFS/Ahlens-AhlensSE-Site/sv_SE/-/SEK/ViewProduct-JSONStart?SKU={id}',
    country: 'SE',
    store: 'ahlens',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  var firstURL = parameters.url.replace('{id}', encodeURIComponent(id));
  await context.goto(firstURL);
  var finalURL = await context.evaluate(async function () {
    let wholeData = document.querySelector('pre').innerText;
    let jsonwholeData = JSON.parse(wholeData);
    return jsonwholeData.product.uri;
  });
  return finalURL;
}