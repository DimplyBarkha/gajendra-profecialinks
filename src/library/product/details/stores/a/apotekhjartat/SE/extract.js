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
    if (await context.evaluate(async () => !window.location.href.toString().includes('soksida'))) {
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
          hs.forEach((h) => { h.setAttribute('id', 'br'); });
          const children = pmDoc.children;
          let secDiv = document.createElement('div');
          secDiv.setAttribute('id', 'section');
          for (let i = 0; i < children.length; i++) {
            if (children[i].id === 'br') {
              document.body.append(secDiv);
              secDiv = document.createElement('div');
              secDiv.setAttribute('id', 'section');
            }
            secDiv.innerHTML += children[i].innerHTML;
          }
          document.body.append(secDiv);
        }

        a = document.evaluate('//div[@id="section" and contains(.,"ur du")]//text()', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        b = a.iterateNext();
        c = [];
        while (b !== null) {
          c.push(b.textContent);
          b = a.iterateNext();
        }
        const div2 = document.createElement('div');
        div2.setAttribute('id', 'directions');
        div2.innerText = c.join(' ');
        document.body.append(div2);

        a = document.evaluate('//div[@id="section" and contains(.,"arningar")]//text()', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        b = a.iterateNext();
        c = [];
        while (b !== null) {
          c.push(b.textContent);
          b = a.iterateNext();
        }
        const div3 = document.createElement('div');
        div3.setAttribute('id', 'warnings');
        div3.innerText = c.join(' ');
        document.body.append(div3);
      });
      const { transform } = parameters;
      const { productDetails } = dependencies;
      return await context.extract(productDetails, { transform });
    }
  },

};
