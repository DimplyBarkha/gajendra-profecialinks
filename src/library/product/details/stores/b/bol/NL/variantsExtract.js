module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform: null,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { variants }) => {
    await context.evaluate(async () => {
      const variantsList = document.createElement('ol');
      variantsList.id = 'added_variants_list';
      variantsList.style.display = 'none';
      document.body.appendChild(variantsList);

      const availableVariants = document.evaluate(
        '(//div[@data-test="features"]//div[@data-test="feature-options"])[1]/a',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      const iterations = availableVariants.snapshotLength || 1;
      for (let i = 0; i < iterations; i++) {
        const listItem = document.createElement('li');
        const variantUrl = availableVariants.snapshotLength
          ? availableVariants.snapshotItem(i).href
          : window.location.href;
        listItem.setAttribute('variant_url', variantUrl);
        variantsList.appendChild(listItem);
      }
    });
    await context.extract(variants);
  },
};
