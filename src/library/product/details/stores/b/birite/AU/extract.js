const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'birite',
    transform,
    domain: 'birite.com.au',
  },
  implementation: async function implementation (
    // @ts-ignore
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(() => {
      const inBox = document.evaluate(
        '//tr[contains(.,"In the Box") or contains(.,"IN THE BOX") or contains(.,"In The BOX") or contains(., "in The Box")]/following-sibling::tr',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      const headings = [];
      const values = [];
      for (let i = 0; i < inBox.snapshotLength; i++) {
        const item = inBox.snapshotItem(i);
        // @ts-ignore
        const strong = item.querySelector('td strong');
        if (strong) {
          break;
        } else {
        // @ts-ignore
          const td1 = item.querySelector('td:nth-child(1)').innerText;
          headings.push(td1);
          // @ts-ignore
          const td2 = item.querySelector('td:nth-child(2)').innerText;
          values.push(td2);
        }
      }
      const len = headings.length;
      let text = '';
      for (let i = 0; i < len; i++) {
        if (values[i]) {
          text += text ? ` || ${headings[i]} : ${values[i]}` : `${headings[i]} : ${values[i]}`;
        } else {
          text += text ? `|| ${headings[i]} ${values[i]}` : `${headings[i]} ${values[i]}`;
        }
      }
      document.body.setAttribute('in-the-box-text', text);
    });

    return await context.extract(productDetails, { transform });
  },
};
