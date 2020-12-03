const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs:: ", inputs);
  const {url, id } = inputs;
  console.log("parameters:: ", parameters);
  //if(id){
  await new Promise((resolve, reject) => setTimeout(resolve, 20000));
  //await context.waitForXPath('//div//span[contains(text(),"Embakasi/Syokimau")]');

  // await context.waitForSelector('div.head span[_ngcontent-naivas-app-c15]');
  // console.log('everything fine !!!');
  // await context.evaluate(() => {
  //   const firstItem = document.querySelector('div.head span[_ngcontent-naivas-app-c15]');
  //   firstItem.click();
  // });
  // try {
  //   await context.waitForSelector('button.loc-btn>span:first-child')
  //   await context.click('button.loc-btn>span:first-child')
  // } catch (error) {
  // console.log('cookie pop up not loded', error);
  //}
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'KE',
    store: 'naivas',
    transform: transform,
    domain: 'naivas.co.ke',
    zipcode: '',
  },
  //implementation,
};
