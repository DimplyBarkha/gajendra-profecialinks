
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
  //const { country, domain, store } = parameters;
  // try {
  //   await context.waitForSelector('div.Button--yellowLight');
  //   await context.click('div.Button--yellowLight');
  //   await new Promise((resolve, reject) => setTimeout(resolve, 4000));
  //   try {
  //     await context.click('button.Link.Link--green.u-textSmall:last-child');
  //     await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   await context.setInputValue('div.CodeInput input:nth-child(1)', zipcode[0]);
  //   await context.setInputValue('div.CodeInput input:nth-child(2)', zipcode[1]);
  //   await context.setInputValue('div.CodeInput input:nth-child(3)', zipcode[2]);
  //   await context.setInputValue('div.CodeInput input:nth-child(4)', zipcode[3]);
  //   await context.setInputValue('div.CodeInput input:nth-child(5)', zipcode[4]);
  //   await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  //   await context.click('ul.List--noSpacing li.TimeslotCell.is-available button');
  //   await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  //   await context.click('button.FlyIn-close');
  // } catch (e) {
  //   console.log(e);
  // }
  // const { url, zipcode } = inputs;
  // const { country, domain, store } = parameters;

  // TODO: add your impl - must be self contained (no require/import/external functions)
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'SE',
    domain: 'coop.se',
    store: 'coop',
    zipcode: "''",
  },
  implementation,
};
