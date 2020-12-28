module.exports = {
  implements: "navigation/goto/setZipCode",
  parameterValues: {
    country: "NZ",
    domain: "paknsave.co.nz",
    store: "paknsave",
    zipcode: "''",
  },
  implementation: async (
    inputs,
    parameterValues,
    context,
    dependencies
  ) => {
    const storeId  = inputs.zipcode
    console.log('storeid', storeId)
    await context.waitForSelector('.fs-selected-store__name.u-bold')
    await context.click('.fs-selected-store__name.u-bold')
    await context.waitForSelector('#change-store')
    await context.click('#change-store')
    await context.waitForSelector('.m-form__input.fs-store-search__input.fs-search-autocomplete__input')
    await context.evaluate( async(storeId) => document.querySelector('.m-form__input.fs-store-search__input.fs-search-autocomplete__input').setAttribute('value', storeId), storeId)
    await context.click('.fs-search-autocomplete__search-btn')
    await new Promise((r) => setTimeout(r, 3000));
    await context.click('.fs-store-search__card-ui.m-fulfillment-selectstore__select > button')
      
    }
  }
