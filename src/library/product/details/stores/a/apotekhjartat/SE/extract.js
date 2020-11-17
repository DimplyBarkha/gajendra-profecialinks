const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'apotekhjartat',
    transform: cleanUp,
    domain: 'apotekhjartat.se',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    try {
      await context.waitForSelector('#pm-document', { timeout: 10000 });
    } catch (e) {
      console.error(e);
    } finally {
      await context.evaluate(() => {
        const repl = document.querySelectorAll('.productMainUSP > li');
        for (let i = 0; i < repl.length; i++) {
          if (i !== 0) {
            repl[i].innerText = '|| ' + repl[i].innerText;
          }
        }
      });
      if (await context.evaluate(async () => (!window.location.href.toString().includes('soksida') && Boolean(document.querySelector('#pm-document'))))) {
        await context.evaluate(async () => {
          let a = document.evaluate('//ul[@class="slides"]/li[not(contains(@class,"clone")) and (position()>2)]/img', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
          let b = a.iterateNext();
          let c = [];
          while (b !== null) {
            c.push(b.getAttribute('src').split('?')[0]);
            b = a.iterateNext();
          }
          const div = document.createElement('div');
          div.setAttribute('id', 'alt-img');
          div.innerText = c.join(' | ');
          document.body.append(div);

          const ing = document.getElementById('product-toc');
          if (ing) {
            let secDiv = document.createElement('div');
            secDiv.setAttribute('id', 'section');
            document.body.append(secDiv);
            secDiv = document.createElement('div');
            secDiv.setAttribute('id', 'section');
            secDiv.append(ing);
            document.body.append(secDiv);
          }
          const pmDoc = document.querySelector('#pm-document');
          if (pmDoc) {
            const hs = document.querySelectorAll('#pm-document>h2');
            hs.forEach((h) => { if (h.innerText.includes('.')) { h.setAttribute('id', 'br'); } });
            const children = pmDoc.children;
            let secDiv = document.createElement('div');
            secDiv.setAttribute('id', 'section');
            for (let i = 0; i < children.length; i++) {
              if (children[i].id === 'br') {
                document.body.append(secDiv);
                secDiv = document.createElement('div');
                secDiv.setAttribute('id', 'section');
              }
              secDiv.appendChild(children[i].cloneNode(true));
            }
            document.body.append(secDiv);
          }
          const createDiv = async function (xpath, id) {
            a = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            b = a.iterateNext();
            c = [];
            while (b !== null) {
              c.push(b.textContent);
              b = a.iterateNext();
            }
            const div2 = document.createElement('div');
            div2.setAttribute('id', id);
            div2.innerText = c.join(' ');
            document.body.append(div2);
          };

          await createDiv("//div[@id='section']//h2[contains(.,'3. ')]//following-sibling::*", 'directions');
          await createDiv("//div[@id='section']//h2[contains(.,'2. ')]//following-sibling::*", 'warnings');
          await createDiv("//div[@id='section']//h2[contains(.,'5. ')]//following-sibling::*", 'storage');
        });
      } else {
        await context.evaluate(async () => {
          const a = document.evaluate('//ul[@class="slides"]/li[not(contains(@class,"clone")) and (position()>2)]/img', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
          let b = a.iterateNext();
          const c = [];
          while (b !== null) {
            c.push(b.getAttribute('src').split('?')[0]);
            b = a.iterateNext();
          }
          const div = document.createElement('div');
          div.setAttribute('id', 'alt-img');
          div.innerText = c.join(' | ');
          document.body.append(div);

          const ing = document.getElementById('product-toc');
          if (ing) {
            let secDiv = document.createElement('div');
            secDiv.setAttribute('id', 'section');
            document.body.append(secDiv);
            secDiv = document.createElement('div');
            secDiv.setAttribute('id', 'section');
            secDiv.append(ing);
            document.body.append(secDiv);
          }
        });
      }
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },

};
