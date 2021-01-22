
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
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const { id } = inputs;
  if (parameters.url) {
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    return url;
  }
  var iframeApiResUrl = await context.evaluate(async function () {
    let url = parameters.url;
    async function getData(url = "") {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response.json:------------------------------- ', response.json);
      return response.json();
    };
    console.log('sai')
    console.log(url)
    const iframeApiRes = await getData(url);
    let urlIframe = iframeApiRes ? iframeApiRes.uri : null;
    return urlIframe;
  });
  if (iframeApiResUrl) {
    console.log('iframe: ', iframeApiResUrl);
    await context.goto(iframeApiResUrl, { timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}