
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IN',
    store: 'flipkart',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: '//a/span[contains(text(), "Next")]/parent::node()',
    dateSelector: 'div[class="date_time"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null, // 'div[not(contains(class,"col JOpGWq"))]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id, date, keywords, page, offset } = inputs;
  const { nextPageUrlSelector, stopConditionSelectorOrXpath, nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, loadedXpath, resultsDivSelector, dateSelector, datePattern, dateReplacePattern, spinnerSelector, openSearchDefinition, nextLinkXpath } = parameters;

  let nextLink;

  if (stopConditionSelectorOrXpath) {
    const conditionIsTrue = await context.evaluate((sel) => {
      try {
        const isThere = document.querySelector(sel);
        return !!isThere;
      } catch (error) {
        try {
          const isThere = document.evaluate(sel, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
          return !!isThere;
        } catch (error) {
          return false;
        }
      }
    }, stopConditionSelectorOrXpath);
    // @ts-ignore
    if (conditionIsTrue) return false;
  }

  await context.evaluate(async function () {
    function addHiddenDiv (el, myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    //  Date
    function timeSince (date2) {
      var now = new Date();
      console.log('-------', date2);
      console.log('--------', typeof (date2));

      var days = date2.match(/\w+/g);
      console.log('----', days);
      if (days != undefined) {
        if (days[0] == 'Today' && days[0] != undefined) {
          var d = new Date();
          d.setDate(d.getDate());
          date2 = date2.replace(date2, d.toString());
        }

        if (days[1] == 'days' || days[1] == 'day' && days[0] != undefined) {
          var d = new Date();
          d.setDate(d.getDate() - parseInt(days[0]));
          date2 = date2.replace(date2, d.toString());
        }

        if (days[1] == 'months' || days[1] == 'month' && days[0] != undefined) {
          var d = new Date();
          d.setMonth(d.getMonth() - parseInt(days[0]));
          date2 = date2.replace(date2, d.toString());
        }
        function getMonthFromString (mon) {
          var d = Date.parse(mon + '1, 2012');
          if (!isNaN(d)) {
            return new Date(d).getMonth() + 1;
          }
          return -1;
        }
        function toDate (dateStr) {
          var parts = dateStr.split('-');
          return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        if (days[0] != 'Today' && days[0] != undefined && days.length <= 2) {
          var s1 = new Date();
          var s2 = s1.getDate();
          var g1 = getMonthFromString(days[0]);
          var date3 = toDate(s2 + '-' + g1 + '-' + days[1]);
          date2 = date2.replace(date2, date3.toString());
        }
        console.log(date2);
      }

      // console.log('DATE STRING', d.toString());
      return date2;
      // return d.toString();
    }

    // Review Text
    // const review_text = document.querySelectorAll('div[class="t-ZTKy"] > div > div');
    const date = document.querySelectorAll('p[class="_2sc7ZR"]');
    const container = document.querySelectorAll('div._27M-vq');
    // console.log('-----', review_text);
    if (container != null && container.length != undefined) {
      for (var i = 0; i < container.length; i++) {
        const searchUrl = window.location.href;
        if (searchUrl.includes('page=')) {
          console.log('Page=2');
          console.log(searchUrl);
          if (date[i]) {
            await new Promise(r => setTimeout(r, 2000));
            const date_time = timeSince(date[i].textContent);
            console.log('-------date--type--------', date_time);
            if (date_time) {
              addHiddenDiv(container[i], 'date_time', date_time);
            }
          }
        }
      }
    }
  });

  if (dateSelector) {
    const stopDateFound = await context.evaluate((sel, stopDate, datePattern, dateReplacePattern) => {
      console.log('STOP DATE');
      try {
        const isThere = document.querySelectorAll(sel);
        if (isThere[isThere.length - 1]) {
          let pageDateStr = isThere[isThere.length - 1].textContent;
          if (datePattern && dateReplacePattern) {
            const pattern = new RegExp(datePattern, 'g');
            pageDateStr = pageDateStr.replace(pattern, dateReplacePattern);
          }

          if (new Date(pageDateStr).getTime() < new Date(stopDate).getTime()) {
            return true;
          }
        }
        return false;
      } catch (error) {
        return error.message;
      }
    }, dateSelector, date, datePattern, dateReplacePattern);
    // @ts-ignore
    console.log(stopDateFound);
    if (stopDateFound) return false;
  }

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
    if (!hasNextLink) return false;
    nextLink = nextLinkSelector;
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
  const { pager } = dependencies;

  const success = openSearchDefinition ? false : await pager({ ...inputs, nextLinkSelector: nextLink, loadedSelector, loadedXpath, mutationSelector, spinnerSelector });

  if (success) {
    return true;
  }

  let url = openSearchDefinition ? false : await context.evaluate((nextSelectors) => {
    const selector = nextSelectors.filter(u => u).join(', ');
    const next = document.querySelector(selector);
    if (!next) return false;
    return next.href;
  }, [nextPageUrlSelector, 'head link[rel="next"]']);

  if (!url && openSearchDefinition) {
    const { pageStartNb = 1, indexOffset, pageOffset, pageIndexMultiplier, template } = openSearchDefinition;
    const pageNb = page + pageStartNb - 1;
    url = template
      .replace(/{searchTerms}/g, encodeURIComponent(keywords))
      .replace(/{id}/g, encodeURIComponent(id))
      .replace(/{date}/g, encodeURIComponent(date))
      .replace(/{page}/g, (pageNb + (pageOffset || 0)).toString())
      .replace(/{index}/g, (pageNb * (pageIndexMultiplier || 0)).toString())
      .replace(/{offset}/g, (offset + (indexOffset || 0)).toString());
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
  if (loadedXpath) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.evaluate(sel, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedXpath, noResultsXPath);
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
}
