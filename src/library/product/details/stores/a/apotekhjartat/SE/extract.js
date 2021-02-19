const { cleanUp } = require('./transform');
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

    let cookieBtnXpath = '//*[contains(@id,"acceptCookieButton")]';
    let cookieBtnPresent = false;
    try {
      await context.waitForXPath(cookieBtnXpath);
      cookieBtnPresent = true;
    } catch(err) {
      console.log('we got some error while waiting for cookie btn', err.message);
      try {
        await context.waitForXPath(cookieBtnXpath);
        cookieBtnPresent = true;
      } catch(error) {
        console.log('we got some error while waiting for cookie btn', error.message);
      }
  
    }

    console.log('cookieBtnPresent', cookieBtnPresent);
    if(cookieBtnPresent) {
      await context.evaluate(async (cookieBtnXpath) => {
        console.log('need to check for cookieBtnXpath',cookieBtnXpath);
        let elms = document.evaluate(cookieBtnXpath, document, null, 7, null);
        let btnElm = {};
        if(elms && elms.snapshotLength > 0) {
          btnElm = elms.snapshotItem(0);
          btnElm.click();
        }
      }, cookieBtnXpath);

      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    

    try {
      await context.waitForSelector('#pm-document', { timeout: 10000 });
    } catch (e) {
      console.error(e);
    } finally {
      await context.evaluate(async () => {
        if (!window.location.href.toString().includes('soksida')) {
          const createDivWithID = (id) => {
            const div = document.createElement('div');
            div.setAttribute('id', id);
            return div;
          };
          // Common Implementation
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

          const div = createDivWithID('alt-img');
          div.innerText = reqData.join(' | ');
          document.body.append(div);

          const ing = document.getElementById('product-toc');
          if (ing) {
            const tocDiv = createDivWithID('toc');
            tocDiv.append(ing);
            document.body.append(tocDiv);
          }

          // Implementation Only if PM-Doc is present

          const pmDoc = document.querySelector('#pm-document');
          if (pmDoc) {
            const hs = document.querySelectorAll('#pm-document>h2');
            hs[0].setAttribute('toc', 'start');
            hs[1].setAttribute('toc', 'end');
            let secDiv = createDivWithID('toc');
            let flag = false;
            for (let i = 0; pmDoc.children[i].getAttribute('toc') !== 'end'; i++) {
              if (flag) { secDiv.append(pmDoc.children[i].cloneNode(true)); }
              if (pmDoc.children[i].getAttribute('toc') !== 'start') { flag = true; }
            }
            document.body.append(secDiv);

            hs.forEach((h) => { if (h.innerText.includes('.')) { h.setAttribute('id', 'br'); } });
            const children = pmDoc.children;
            secDiv = createDivWithID('section');
            for (let i = 0; i < children.length; i++) {
              if (children[i].id === 'br') {
                document.body.append(secDiv);
                secDiv = createDivWithID('section');
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
              const div2 = createDivWithID(id);
              div2.innerText = reqData.join(' ');
              document.body.append(div2);
            };

            await createDiv("//div[@id='section']//h2[contains(.,'3. ')]//following-sibling::*", 'directions');
            await createDiv("//div[@id='section']//h2[contains(.,'2. ')]//following-sibling::*", 'warnings');
            await createDiv("//div[@id='section']//h2[contains(.,'5. ')]//following-sibling::*", 'storage');
          }

          let gtinXpath = '//*[contains(text(),"gtin")]';
          let elm = document.evaluate(gtinXpath, document, null, 7, null);
          let text = '';
          if(elm && elm.snapshotLength > 0) {
            text = elm.snapshotItem(0).textContent;
          }
          if(text) {
            text = text.trim();
          }
          let jsonObj = {};
          try {
            jsonObj = JSON.parse(text);
          } catch(err) {
            console.log('got some error while parsing text to json', err.message);
          }
          
          let gtin = '';
          let brand = '';
          if(Object.keys(jsonObj).length > 0) {
            if(jsonObj.hasOwnProperty('gtin13')) {
              gtin = jsonObj['gtin13'];
            } else {
              console.log('could not get gtin');
            }
            if(jsonObj.hasOwnProperty('offers') && jsonObj['offers'].hasOwnProperty('seller') && jsonObj['offers']['seller'].hasOwnProperty('name')) {
              brand = jsonObj['offers']['seller']['name'];
              brand = brand ? brand.trim() : '';
            } else {
              console.log('was not able to get the brand info');
            }
          }
          
          if(brand) {
            console.log('brand', brand);
            let divBrand = createDivWithID('brand');
            divBrand.innerText = brand;
            document.body.append(divBrand);
          }
          
          if(gtin) {
            console.log('gtin', gtin);
            let divgtin = createDivWithID('gtin');
            divgtin.innerText = gtin;
            document.body.append(divgtin);
          }
          
        }
      });
    }

    if (await context.evaluate(() => !window.location.href.toString().includes('soksida'))) {
      const { transform } = parameters;
      const { productDetails } = dependencies;
      return await context.extract(productDetails, { transform });
    }
  },

};
