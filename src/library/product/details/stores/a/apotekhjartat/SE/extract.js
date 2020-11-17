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
      if (await context.evaluate(() => !window.location.href.toString().includes('soksida'))) {
        // Common Implementation
        await context.evaluate(() => {
          const repl = document.querySelectorAll('.productMainUSP > li');
          for (let i = 0; i < repl.length; i++) {
            if (i !== 0) {
              repl[i].innerText = '|| ' + repl[i].innerText;
            }
          }
          const tempIterator = document.evaluate('//ul[@class="slides"]/li[not(contains(@class,"clone")) and (position()>2)]/img', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
          let nodeElement = tempIterator.iterateNext();
          const reqData = [];
          while (nodeElement) {
            reqData.push(nodeElement.getAttribute('src').split('?')[0]);
            nodeElement = tempIterator.iterateNext();
          }
          const div = document.createElement('div');
          div.setAttribute('id', 'alt-img');
          div.innerText = reqData.join(' | ');
          document.body.append(div);

          const ing = document.getElementById('product-toc');
          if (ing) {
            const secDiv = document.createElement('div');
            secDiv.setAttribute('id', 'toc');
            secDiv.append(ing);
            document.body.append(secDiv);
          }
        });
        // Implementation Only if PM-Doc is present
        await context.evaluate(async () => {
          const pmDoc = document.querySelector('#pm-document');
          if (pmDoc) {
            const hs = document.querySelectorAll('#pm-document>h2');
            hs[0].setAttribute('toc', 'start');
            hs[1].setAttribute('toc', 'end');

            let secDiv = document.createElement('div');
            secDiv.setAttribute('id', 'toc');
            let flag = false;
            for (let i = 0; pmDoc.children[i].getAttribute('toc') !== 'end'; i++) {
              if (flag) { secDiv.append(pmDoc.children[i].cloneNode(true)); }
              if (pmDoc.children[i].getAttribute('toc') !== 'start') { flag = true; }
            }
            document.body.append(secDiv);

            hs.forEach((h) => { if (h.innerText.includes('.')) { h.setAttribute('id', 'br'); } });
            const children = pmDoc.children;
            secDiv = document.createElement('div');
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

            const createDiv = async function (xpath, id) {
              const tempIterator = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
              let nodeElement = tempIterator.iterateNext();
              const reqData = [];
              while (nodeElement) {
                reqData.push(nodeElement.textContent);
                nodeElement = tempIterator.iterateNext();
              }
              const div2 = document.createElement('div');
              div2.setAttribute('id', id);
              div2.innerText = reqData.join(' ');
              document.body.append(div2);
            };

            await createDiv("//div[@id='section']//h2[contains(.,'3. ')]//following-sibling::*", 'directions');
            await createDiv("//div[@id='section']//h2[contains(.,'2. ')]//following-sibling::*", 'warnings');
            await createDiv("//div[@id='section']//h2[contains(.,'5. ')]//following-sibling::*", 'storage');
          }
        });
      }
    }
    if (await context.evaluate(() => !window.location.href.toString().includes('soksida'))) {
      const { transform } = parameters;
      const { productDetails } = dependencies;
      return await context.extract(productDetails, { transform });
    }
  },

};
