async function implementation (
  inputs, parameters, context, dependencies,
) {
  const { zipcode } = inputs;

  await context.evaluate(async function () {
    const suggetionModel = document.querySelector('h5.suggested-store-close');
    if (suggetionModel) {
      suggetionModel.click();
    }
  });

  const getCurrentZip = async () => {
    return await context.evaluate(async function () {
      const element = document.querySelector('a#headerDropMenuPhoneNumber');
      if (element) {
        return element.getAttribute('href').split(':')[1];
      }
      return null;
    });
  };

  const findButtonWithStoreSelect = async () => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.evaluate(function () {
      const mystore = document.querySelector('button.shopButton');
      if (mystore) mystore.click();
    });
  };

  const changeZip = async (wantedZip) => {
    await context.click('button.change-store-header');
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    await context.setInputValue('input#SearchBox', wantedZip);
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    await context.click('span#SearchStoreSubmit');
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await findButtonWithStoreSelect();
    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  };

  const currentZip = await getCurrentZip();
  console.log(`Want zip: ${zipcode}, got zip: ${currentZip}`);

  if (currentZip !== zipcode) {
    console.log('Trying to change zip');
    await changeZip(zipcode);
  }

  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'petsuppliesplus.com',
    store: 'petsuppliesplus',
    zipcode: '',
  },
  implementation,
};
