const { transform } = require('./variantFormat');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;

  await context.waitForSelector('div[data-automation="colour-select-container"]>div[class="select-wrapper"]>button[data-automation="select-colour"]');
  await context.click('div[data-automation="colour-select-container"]>div[class="select-wrapper"]>button[data-automation="select-colour"]');
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  await context.evaluate(function () {
    document.body.setAttribute('currentURL',window.location.href.replace(/#.*/,''));
  })
  return await context.extract(variants, { transform });
  
}


module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    transform,
    domain: 'myer.com.au',
    zipcode: "''",
  },
  implementation
};
