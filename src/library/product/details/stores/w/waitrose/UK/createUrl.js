
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
    const detailsPage = await context.evaluate(async () => {
      if (document.querySelector('div[id="introAgreeButton"] span[class="CwaK9"] span[class="RveJvd snByac"]') !== null) {
        document.querySelector('div[id="introAgreeButton"] span[class="CwaK9"] span[class="RveJvd snByac"]').click();
      }
      if (document.querySelector('div[class="bErdLd aID8W wwYr3"]') !== null && document.querySelector('div[class="t7xA6 m114nf aID8W"]') !== null) {
        document.querySelector('div[class="bErdLd aID8W wwYr3"]').remove();
        document.querySelector('div[class="t7xA6 m114nf aID8W"]').remove();
      }
      if (document.querySelector('div[class="yuRUbf"] a') !== null) {
        return document.querySelector('div[class="yuRUbf"] a').getAttribute('href');
      }
    });
    return detailsPage || url;
  }
}
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'waitrose.com',
    prefix: null,
    country: 'UK',
    store: 'waitrose',
    url: 'https://www.google.com/search?q=site:/www.waitrose.com%20{id}',
    zipcode: '',
  },
  dependencies: {
    goto: 'action:navigation/goto',
  },
  implementation,
};
