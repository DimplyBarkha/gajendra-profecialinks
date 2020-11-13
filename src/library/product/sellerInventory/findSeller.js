
/**
 *
 * @param { { id: any, sellerId: any } } inputs
 * @param { { country: any, domain: any, store: any, addToCartButton: any, findFunction: any, rowXpath: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { someAction: ImportIO.Action, someFunction: () => void, someExtraction: string } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id, sellerId } = inputs;
  const { addToCartButton, findFunction, rowXpath } = parameters;
  console.log('FIND SELLER parameters', parameters);
  let rows = 0;
  if (rowXpath) {
    // @ts-ignore
    rows = await context.evaluate((rowXpath) => {
      return document.evaluate(`count(${rowXpath})`, document).numberValue;
    }, rowXpath);
    if (rows === 0) {
      return { results: rows, foundSeller: false };
    }
  }
  /* This code might have issues.
  if (addToCartButton) {
    const xpath = addToCartButton.replace(/{sellerId}/g, sellerId).replace(/{id}/g, id);
    const button = await context.evaluate((xpath) => {
      const result = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      const button = result.iterateNext();
      console.log('button', button);
      button && button.click();
      return !!button;
    }, xpath);
    if (button) {
      await context.waitForNavigation({ timeout: 30000 });
    }
    return { results: rows, foundSeller: button };
  } */
  if (findFunction) {
    const foundSeller = await findFunction({ context, sellerId });
    return { results: rows, foundSeller };
  }
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '',
      optional: false,
    },
    {
      name: 'domain',
      description: '',
      optional: false,
    },
    {
      name: 'store',
      description: '',
      optional: false,
    },
    {
      name: 'findFunction',
      description: 'function find seller. should return boolean to check if seller was found or not.',
      optional: true,
    },
    {
      name: 'addToCartButton',
      description: 'cart button in case we can find one for particular sellerId. Ex: "//a[contains(@href,{sellerId}) && contains(@href,{id})]"',
      optional: true,
    },
    {
      name: 'rowXpath',
      description: 'to count number of results in a page for pagination."',
      optional: false,
    },
    {
      name: 'navigationLoadedSelector',
      description: 'wait after findFunction."',
      optional: false,
    },
  ],
  inputs: [
    {
      name: 'id',
      description: '',
      type: 'string',
      optional: false,
    },
    {
      name: 'sellerId',
      description: '',
      type: 'string',
      optional: false,
    },
  ],
  dependencies: {},
  path: './stores/${store[0:1]}/${store}/${country}/findSeller',
  implementation,
};
