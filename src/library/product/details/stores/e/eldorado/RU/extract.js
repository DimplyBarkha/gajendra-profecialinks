const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    transform: cleanUp,
    domain: 'eldorado.ru',
    zipcode: '',
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

    try {
      await context.evaluate(() => {
        const inTheBoxEnhanced = document.evaluate(
          '//table[@class="complection"]//p | //h2[contains(.,"Комплектация")]/following-sibling::div[contains(@class, "pul-left")]//p',
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );
        let text = '';
        if (inTheBoxEnhanced.snapshotLength !== 0) {
          for (let i = 0; i < inTheBoxEnhanced.snapshotLength; i++) {
            const item = inTheBoxEnhanced.snapshotItem(i);
            text = text + (text ? ' || ' : '') + item.textContent;
          }
        } else {
          const inBox = document.evaluate(
            '//tr[contains(@class, "q123")][contains(.,"Комплектация")]/following-sibling::tr',
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
            const z = item.className.includes('q123');
            if (z) {
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
          for (let i = 0; i < len; i++) {
            if (values[i]) {
              text += text ? ` || ${headings[i]} : ${values[i]}` : `${headings[i]} : ${values[i]}`;
            } else {
              text += text ? `|| ${headings[i]} ${values[i]}` : `${headings[i]} ${values[i]}`;
            }
          }
        }
        document.body.setAttribute('in-the-box-text', text);
      });
    } catch (e) {
      console.log('Error: ' + e.message);
    }
    return await context.extract(productDetails, { transform });
  },
};
