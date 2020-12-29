module.exports = {
  implements: "navigation/goto/setZipCode",
  parameterValues: {
    country: "NZ",
    domain: "paknsave.co.nz",
    store: "paknsave",
    zipcode: "''",
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const storeId = inputs.zipcode;
    console.log("storeid", storeId);
    await new Promise((r) => setTimeout(r, 3000));
    await context.waitForSelector(".fs-selected-store__name.u-bold");
    const popup = await context.evaluate(() =>
      document.querySelector("fs-tooltip__close-btn > i")
    );
    if (popup) {
      await context.click("fs-tooltip__close-btn > i");
    }
    await context.click(".fs-selected-store__name.u-bold");
    await context.waitForSelector("#change-store");
    await context.click("#change-store");
    await context.waitForSelector(
      ".m-form__input.fs-store-search__input.fs-search-autocomplete__input"
    );
    await context.setInputValue(
      ".m-form__input.fs-store-search__input.fs-search-autocomplete__input",
      storeId
    );
    await context.waitForSelector(".fs-search-autocomplete__search-term");
    await context.click(".fs-search-autocomplete__search-term");
    await new Promise((r) => setTimeout(r, 3000));
    await context.click(
      ".fs-store-search__card-ui.m-fulfillment-selectstore__select > .btn.btn--primary.btn--large.select-store"
    );
    await context.waitForSelector(
      ".fs-book-slot-notice__action.fs-book-slot-notice__action-less-preferred.u-bold"
    );
    await context.click(
      ".fs-book-slot-notice__action.fs-book-slot-notice__action-less-preferred.u-bold"
    );
  },
};
