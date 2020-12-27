/**
 *
 * @param { { url: any, zipcode: any } } inputs
 * @param { { country: any, domain: any, store: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { someAction: ImportIO.Action, someFunction: () => void, someExtraction: string } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { url, zipcode } = inputs;
  const { country, domain, store } = parameters;
  const suggesationsCSS = 'div.MainSearch-locationAndDistance ul[role="listbox"] li';
  const zipAndRegion = {
    2075: 'st ives, nsw'
  }

  const regionText = zipAndRegion[zipcode];
  console.log(`regionText: ${regionText}`);
  await context.waitForSelector('.MainSearch-locationAndDistance input');
  await context.setInputValue(`.MainSearch-locationAndDistance input`, zipcode);
  await context.waitForSelector(suggesationsCSS);
  const positionInSuggesation = await context.evaluate(async(css, regionText) => {
    const position = [...document.querySelectorAll(css)].map(e => e.innerText.toLowerCase()).indexOf(regionText.toLocaleLowerCase());
    if(position === -1) console.log('No dropdown region found...');
    console.log(`{ regionText : ${regionText}, position: ${position}`);
    return position + 1;
  }, suggesationsCSS, regionText);

  const positionInSuggesationCSS = `${suggesationsCSS}:nth-child(${positionInSuggesation})`;
  console.log(`Selecting ${positionInSuggesation} no suggestion, CSS: ${positionInSuggesationCSS}`);
  await context.click(positionInSuggesationCSS);
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'AU',
    domain: 'shopmylocal.com.au',
    store: 'shopmylocal',
    zipcode: '',
  },
  implementation
};
