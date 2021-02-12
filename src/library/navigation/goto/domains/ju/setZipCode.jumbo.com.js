module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'NL',
    domain: 'jumbo.com',
    store: 'jumbo',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { url, zipcode, storeId } = inputs;
    const selectStoreUrl = 'https://www.jumbo.com/winkels';

    // going to store select page
    await context.goto(selectStoreUrl);

    // checking if input exists and entering zipcode value
    await context.waitForSelector('div[class="jum-store-search-bar"] > input');
    await context.setInputValue('div[class="jum-store-search-bar"] > input', zipcode);
    await context.evaluate(async () => {
      const searchButton = document.querySelector('button.jum-btn-store-search');
      if (searchButton) {
        searchButton.removeAttribute('disabled');
        // @ts-ignore
        searchButton.click();
      }
    });
    // choosing store
    await context.waitForSelector('div#jum-store-list > ul > li:first-child');
    await context.click('div#jum-store-list > ul > li:first-child');
    await context.evaluate(async () => {
      const isStoreClicked = document.querySelector('div#jum-store-list > ul > li:first-child button[data-jum-action="savePreferredStore"]');
      if (!isStoreClicked) {
        // @ts-ignore
        document.querySelector('div#jum-store-list > ul > li:first-child').click();
      }
    });
    await context.waitForSelector('div#jum-store-list > ul > li:first-child button[data-jum-action="savePreferredStore"]');
    await context.click('div#jum-store-list > ul > li:first-child button[data-jum-action="savePreferredStore"]');
    await context.evaluate(async () => {
      const isStoreSelected = document.querySelector('div#jum-store-list > ul > li:first-child button[data-jum-action="savePreferredStore"][disabled]');
      if (!isStoreSelected) {
        // @ts-ignore
        document.querySelector('div#jum-store-list > ul > li:first-child button[data-jum-action="savePreferredStore"]').click();
      }
    });
    await context.waitForSelector('div#jum-store-list > ul > li:first-child button[data-jum-action="savePreferredStore"][disabled]');

    // going to product page
    await context.goto({ url, zipcode, storeId });
  },
};
