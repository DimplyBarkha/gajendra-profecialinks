
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { loadedSelector, noResultsXPath, nextLinkSelector } = parameters;

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  console.log('Checking no results', noResultsXPath);

  const checkIfResults = await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);

  if (!checkIfResults) {
    return false;
  }

  function getFormattedDate (reviewDate, days, months) {
    const rawDate = new Date(reviewDate);
    if (days) {
      rawDate.setDate(rawDate.getDate() - parseInt(days));
    } else if (months) {
      rawDate.setMonth(rawDate.getMonth() - parseInt(months));
    }

    let month = (rawDate.getMonth() + 1).toString();
    let day = rawDate.getDate().toString();
    const year = rawDate.getFullYear().toString();

    if (month.length < 2) {
      month = `0${month}`;
    }
    if (day.length < 2) {
      day = `0${day}`;
    }
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);
    return formattedDate;
  }

  function checkIfReviewIsFromLast30Days (lastDate, reviewDate) {
    if (reviewDate.match(/(\d+) día/)) {
      reviewDate = getFormattedDate(lastDate, reviewDate.match(/(\d+) día/)[1]);
    } else if (reviewDate.match(/(\d+) mes/)) {
      reviewDate = getFormattedDate(lastDate, null, reviewDate.match(/(\d+) mes/)[1]);
    } else {
      console.log('no match found, returning false');
      return false;
    }

    console.log('lastDate' + lastDate);
    console.log('reviewDate' + reviewDate);
    const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
    console.log('timestamp' + timestamp);
    console.log(new Date(reviewDate).getTime());
    if (new Date(reviewDate).getTime() >= timestamp) {
      console.log('True');
      return true;
    }
    console.log('false');
    return false;
  }

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate(({ selector }) => {
      const elem = document.querySelector(selector);
      if (!elem) return false;
      console.log('Clicking', selector);
      elem.click();
      return true;
    }, { selector: nextLinkSelector });
    if (!hasNextLink) return false;
  }

  await context.waitForNavigation({ timeout: 40000 });
  await new Promise((resolve, reject) => setTimeout(resolve, 15000));

  const lastReviewDate = await context.evaluate(function () {
    return document.evaluate('//script[@id=\'bv-jsonld-reviews-data\']', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.textContent.replace(/(.+)"review":\[{"@type":"Review","dateCreated":"((\d+)-(\d+)-(\d+))(.+)",(.+)/, '$2');
  });

  const reviewDate = await context.evaluate(function () {
    return document.evaluate('(//div[contains(@class,\'bv-content-datetime\')]/span[contains(@class,\'bv-content-datetime-stamp\')])[1]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.textContent;
  });

  // check if the review in the current page should be extracted or not
  if (checkIfReviewIsFromLast30Days(lastReviewDate, reviewDate)) {
    return true;
  }
  return false;
}

module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'ES',
    store: 'elcorteingles',
    nextLinkSelector: 'li.bv-content-pagination-buttons-item-next > a',
    loadedSelector: 'ol.bv-content-list-reviews > li',
    noResultsXPath: '//button[contains(.,"Escribe la primera opinión de este producto")] | //meta[@name="twitter:url"][@content="https://www.elcorteingles.es/electrodomesticos/"]',
    domain: 'elcorteingles.es',
  },
  implementation,
};
