module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FR',
    domain: 'lentillesmoinscheres.com',
    store: 'lentillesmoinscheres',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productMenu }) => {
    await context.evaluate(async () => {
      const addedUrlsList = document.createElement('ol');
      addedUrlsList.id = 'added_urls_list';
      addedUrlsList.style.display = 'none';
      document.body.appendChild(addedUrlsList);

      const allMenuUrls = document.evaluate(
        '//div[@id="responsiveMenuCategs"]/div/ul//li[not(contains(@class, "visible-xs")) and not(contains(@class, "hidden"))]/a[@href and @title]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );

      const addedUrlsArr = [];
      for (let i = 0; i < allMenuUrls.snapshotLength; i++) {
        const elem = allMenuUrls.snapshotItem(i);
        if (!addedUrlsArr.includes(elem.href)) {
          addedUrlsArr.push(elem.href);
          const listItem = document.createElement('li');
          listItem.setAttribute('category', elem.textContent || elem.getAttribute('title'));
          listItem.setAttribute('categoryUrl', elem.href);
          addedUrlsList.appendChild(listItem);
        }
      }
    });
    await context.extract(productMenu);
  },
};
