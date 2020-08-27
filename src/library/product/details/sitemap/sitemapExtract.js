
/**
 *
 * @param { { url: any, id: any } } inputs
 * @param { { country: any, transform: any, store: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */

const { Helpers } = require('../../../helpers/helpers');

async function implementation (
  inputs,
  parameters = {},
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { sitemap } = dependencies;
  const helpers = new Helpers(context);

  const urlSelector = '.line:first-child span.html-tag ~ :not(.html-tag)';

  const urls = await context.evaluate((urlSelector) => [...document.querySelectorAll(urlSelector)].map(u => u.innerText), urlSelector);
  
  await helpers.addArrayToDocument('prodURL', urls);

  return await context.extract(sitemap, { transform });
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '',
      optional: false,
    },
    {
      name: 'store',
      description: '',
      optional: false,
    },
    {
      name: 'transform',
      description: 'transform function for the extraction',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'url',
      description: '',
      type: 'string',
      optional: false,
    },
  ],
  dependencies: {
    sitemap: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/sitemapExtract',
  },
  implementation,
};
