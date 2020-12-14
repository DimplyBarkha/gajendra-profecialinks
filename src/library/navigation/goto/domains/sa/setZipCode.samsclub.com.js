
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
  ) {
  const { zipcode, storeId } = inputs;
  await context.evaluate(async() => {
  const changeButton = document.querySelector('div[class="club-container"]>button[class="sc-btn fake-link"]>span');
  if (changeButton) {
  console.log('entered if block');
  changeButton.click();
  console.log('button clicked sucessfully');
  await new Promise(resolve => { setTimeout(resolve, 15000); });
  }
  console.log('sucessfully clicked the change button');
  });
  await context.setInputValue('div[class="sc-find-clubs-input"]>form>div[class="sc-input-box"] input', `${zipcode}`);
  await context.evaluate(async() => {
  const searchButton = document.querySelector('button[class="sc-btn sc-btn-primary find"]');
  if (searchButton) {
  searchButton.click();
  await new Promise(resolve => { setTimeout(resolve, 15000); });
  console.log('able to click the button');
  }
  if (storeId) {
  const selectElementAll = document.querySelectorAll('div[class="sc-club-result result-chevron"]');
  // @ts-ignore
  const ourElement = [...selectElementAll].find((element) => element.innerText.includes(`${storeId}`));
  const selectButton = ourElement.querySelector('button[class="sc-club-result-set-club"]');
  selectButton.click();
  } else {
  const selectButton = document.querySelector('div[class="sc-club-results"]>div:first-child>div>button');
  if (selectButton) {
  selectButton.click();
  }
  }
  
  await new Promise(resolve => { setTimeout(resolve, 15000); });
  });
  }
  module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'samsclub.com',
    store: 'samsclub',
    zipcode: '',
  },
implementation,
};
