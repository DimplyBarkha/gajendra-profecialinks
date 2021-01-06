async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  let url;
  if (inputs.url) {
    url = inputs.url;
  } else if (parameters.reviewUrl && inputs.id) {
    url = parameters.reviewUrl.replace(/{id}/g, inputs.id);
  }
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  await context.waitForSelector('iframe:not([src])', { timeout: 7000 })
    .catch(() => console.log('No age verification needed!'));
  await context.evaluate(() => {
    const ageConfIframe = document.querySelector('iframe:not([src])');
    if (ageConfIframe) {
      const dismissButton = ageConfIframe.contentDocument.querySelector('button[data-trigger="dismiss"]');
      if (dismissButton) {
        dismissButton.click();
      }
    }
  });

  if (parameters.sortButtonSelector) {
    const selectors = parameters.sortButtonSelector.split('|');
    for (const selector of selectors) {
      await context.click(selector);
    }
  }
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  // only want reviews of items matching input brand from search:
  const { Brands } = inputs;
  if (Brands) {
    const onDesiredBrand = await context.evaluate((Brands) => {
      const BrandEl = document.querySelector('span[class*="title--brand"]');
      return (BrandEl && BrandEl.textContent.toLowerCase().includes(Brands.toLowerCase()));
    }, Brands);
    if (!onDesiredBrand) {
      return false;
    }
  }

  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}

module.exports = {
  implementation,
};
