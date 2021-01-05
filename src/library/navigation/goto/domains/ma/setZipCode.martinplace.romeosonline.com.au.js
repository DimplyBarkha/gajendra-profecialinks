
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'AU',
    domain: 'martinplace.romeosonline.com.au',
    store: 'romeos',
    zipcode: '',
  },

  implementation: async (inputs, parameterValues, context, dependencies) => {
    const storeId = inputs.Postcode;
    console.log('storeid', storeId);
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.click('div.store-chooser > a');
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    if (storeId === 'North Adelaide') {
    // @ts-ignore
      await context.click(('.StoreChooser__List').children[0]);
    } else if (storeId === 'Martin Place') {
      await context.click(('.StoreChooser__List').children[1]);
    } else if (storeId === 'North Sydney') {
      await context.click(('.StoreChooser__List').children[2]);
    }
  },
};
