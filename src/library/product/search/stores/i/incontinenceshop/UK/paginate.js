
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'incontinenceshop',
    // nextLinkSelector: 'li[class="item pages-item-next"]>a',
    loadedSelector: 'body',
    openSearchDefinition: {
      template: 'https://www.incontinenceshop.com/catalogsearch/result/index/?p={page}&q={searchTerms}',
    },
    stopConditionSelectorOrXpath: 'div[id="noResults"]',
    domain: 'incontinenceshop.com',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id, date, keywords, page, offset } = inputs;
  const { stopConditionSelectorOrXpath, nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, loadedXpath, resultsDivSelector, spinnerSelector, openSearchDefinition, nextLinkXpath } = parameters;

  let nextLink;
  const { pager } = dependencies;

  const success = openSearchDefinition ? false : await pager({ ...inputs, nextLinkSelector: nextLink, loadedSelector, loadedXpath, mutationSelector, spinnerSelector });

  if (success) {
    return true;
  }

  let url = openSearchDefinition ? false : await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const next = document.querySelector('head link[rel="next"]');
    if (!next) {
      return false;
    }
    return next.href;
  });

  if (!url && openSearchDefinition) {
    const PageNumber = await context.evaluate(async () => {
      // Method to Retrieve Xpath content of a Single Node
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      let PageNumber = getXpath("//li[@class='item pages-item-next']/a/@href", 'nodeValue');
      if (PageNumber != null) {
        return PageNumber.split('?')[1].split('&')[0].split('=')[1];
      }
    });
    const { pageStartNb = 1, indexOffset, pageOffset, pageIndexMultiplier, template } = openSearchDefinition;
    if (PageNumber != null) {
      const pageNb = PageNumber;
      url = template
        .replace(/{searchTerms}/g, encodeURIComponent(keywords))
        .replace(/{id}/g, encodeURIComponent(id))
        .replace(/{date}/g, encodeURIComponent(date))
        .replace(/{page}/g, (pageNb).toString())
        .replace(/{index}/g, (pageNb * (pageIndexMultiplier || 0)).toString())
        .replace(/{offset}/g, (offset + (indexOffset || 0)).toString());
    }
  }
  if (!url) {
    return false;
  }

  console.log('Going to url', url);
  await dependencies.goto({ url });
  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const e = r.iterateNext();
    return !e;
  }, noResultsXPath);
}
