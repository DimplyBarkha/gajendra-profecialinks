module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'ES',
    domain: 'maquillalia.com',
    store: 'maquillalia',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productMenu }) => {
    await context.evaluate(async () => {
      const addedListElem = document.createElement('ol');
      addedListElem.id = 'added_list_item';
      addedListElem.style.display = 'none';
      document.body.appendChild(addedListElem);

      const allMenuUrls = document.evaluate(
        '//div[contains(@class, "HeaderBot")]/nav/ul[not(contains(@class, "OnlyMobile"))]//a[@href][not(picture)]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      const addedUrlsArr = [];
      for (let i = 0; i < allMenuUrls.snapshotLength; i++) {
        const elem = allMenuUrls.snapshotItem(i);
        if (!elem.parentElement.parentElement.className.includes('ListTopSel')) {
          const url = elem.href;
          if (!addedUrlsArr.includes(url)) {
            addedUrlsArr.push(url);
            const listItem = document.createElement('li');
            listItem.setAttribute('category', elem.textContent.trim() || elem.title);
            listItem.setAttribute('categoryUrl', url);
            addedListElem.appendChild(listItem);
          }
        }
      }
    });

    await context.extract(productMenu);
  },
};
