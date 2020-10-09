const { transform } = require('../../../../shared');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForSelector('[data-flix-ean]');
  await context.evaluate(async function () {
    async function addEnhancedContent () {
      const div = document.createElement('div');
      div.setAttribute('class', 'IcecatLive -icecat-tabs_body for-title,gallery,featurelogos,essentialinfo,bulletpoints,marketingtext,manuals,reasonstobuy,tours3d,videos,featuregroups,reviews,productstory');
      const script = document.createElement('script');
      script.setAttribute('src', 'https://icecat.biz/stats/scripts/trackLive.js');
      div.append(script);
      const gtin = document.querySelector('[data-flix-ean]').getAttribute('data-flix-ean');
      const response = await fetch(`https://live.icecat.biz/api/html?lang=es&content=title,gallery,featurelogos,essentialinfo,bulletpoints,marketingtext,manuals,reasonstobuy,tours3d,videos,featuregroups,reviews,productstory&version=2.0.0&UserName=v.poezevara&GTIN=${gtin}`);
      const html = await response.text();
      div.innerHTML += html;
      document.querySelector('#IcecatLive').append(div);
    }
    await addEnhancedContent();
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'pixmania',
    transform: transform,
    domain: 'pixmania.es',
  },
  implementation,
};
