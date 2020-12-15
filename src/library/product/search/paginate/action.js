/**
 *
 * @param {{
 *  keywords: string,
 *  page: number,
 *  offset: number,
 * }} inputs
 * @param {{
 *  nextLinkSelector: string,
 *  mutationSelector: string,
 *  loadedSelector: string,
 *  noResultsXPath: string,
 *  spinnerSelector: string,
 *  openSearchDefinition: { template: string, indexOffset?: number, pageOffset?: number }
 * }} parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords, page, offset } = inputs;
  const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;

module.exports = require('../../../navigation/paginate/action');
