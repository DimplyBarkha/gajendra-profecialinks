
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
  // const helpers = new Helpers(context);

  const urlSelector = '.line:first-child span.html-tag ~ :not(.html-tag)';

  const urls = await context.evaluate((urlSelector) => [...document.querySelectorAll(urlSelector)].map(u => u.innerText), urlSelector);

  // await helpers.addArrayToDocument('prodURL', urls);
  const addArrayToDocument = async (key, values, { parentID = '', type = 'div', clss = '' } = {}) => {
    const inputs = { key, values, parentID, type, clss };
    await context.evaluate((inputs) => {
      const addArrayToDocument = ({ key: id, values, parentID, type, clss }) => {
        const htmlString = `<${type} id="${id}" ${clss ? `class="${clss}" ` : ''}></${type}>`;
        const root = parentID ? document.querySelector(parentID) : document.body;
        root.insertAdjacentHTML('beforeend', htmlString);
        if (Array.isArray(values)) {
          const innerHTML = values.reduce((acc, val) => {
            return `${acc}<li>${val}</li>`;
          }, '<ul>') + '</ul>';
          document.querySelector(`#${id}`).innerHTML = innerHTML;
        } else {
          throw new Error('The provided values are not an array.');
        }
      };
      addArrayToDocument(inputs);
    }, inputs);
  };
  addArrayToDocument('prodURL', urls);

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
