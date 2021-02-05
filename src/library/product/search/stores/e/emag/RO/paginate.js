
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RO',
    store: 'emag',
    nextLinkSelector: null,
    nextLinkXpath: '//a[@aria-label="Next"]/span[contains(text(), "Pagina urmatoare")]/parent::a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="card_grid"]',
    noResultsXPath: '//span[text()="0 rezultate pentru:"]|//h1[@class="listing-page-title js-head-title"]//span[contains(text(), "0 rezultate")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'emag.ro',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { loadedSelector, noResultsXPath, mutationSelector, loadedXpath, resultsDivSelector, spinnerSelector, nextLinkXpath, openSearchDefinition } = parameters;
    const { pager } = dependencies;
    let nextLink;

    const isButtonToCaptcha = await context.evaluate(() => {
      console.log('Check button that informs about bolcked page');
      return !!document.querySelector('div.captcha-button button');
    });

    console.log('isButtonToCaptchaExist? ', isButtonToCaptcha);

    if (isButtonToCaptcha) {
      throw Error('BUTTON TO CAPTCHA OCCURRED IN PAGINATION');
    }

    const isCaptcha = await context.evaluate(() => {
      console.log('Check if captcha exist');
      return !!document.querySelector('iframe[title="testare reCAPTCHA"]');
    });

    console.log('isCaptchaExist? ', isCaptcha);

    if (isCaptcha) {
      throw Error('CAPTCHA OCCURED IN PAGINATION');
    }

    if (nextLinkXpath) {
      // add a unique ID to the elem so it can be targeted by css
      const uuid = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const hasNextLink = await context.evaluate(({ selector, uuid }) => {
        const elem = document.evaluate(selector, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        if (elem && elem.singleNodeValue && elem.singleNodeValue.nodeType === 1) { // check the node type is element
          // @ts-ignore
          elem.singleNodeValue.id = uuid;
          return true;
        }
        return false;
      }, { selector: nextLinkXpath, uuid });
      if (!hasNextLink) return false;
      nextLink = `#${uuid}`;
    }

    const success = await pager({ ...inputs, nextLinkSelector: nextLink, loadedSelector, loadedXpath, mutationSelector, spinnerSelector });

    if (success) {
      return true;
    }

    const url = openSearchDefinition ? false : await context.evaluate(function () {
      /** @type { HTMLLinkElement } */
      const next = document.querySelector('head link[rel="next"]');
      if (!next) {
        return false;
      }
      return next.href;
    });

    console.log('Going to url', url);
    await dependencies.goto({ url });

    if (loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, loadedSelector, noResultsXPath);
    }

    console.log('Checking no results', noResultsXPath);

    if (resultsDivSelector) {
      // counting results
      const resultNB = await context.evaluate(sel => document.querySelectorAll(sel).length, resultsDivSelector);
      console.log(`The page has: ${resultNB} results. Pagination continues: ${!!resultNB}`);
      return !!resultNB;
    }

    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      const e = r.iterateNext();
      return !e;
    }, noResultsXPath);
  },
};
