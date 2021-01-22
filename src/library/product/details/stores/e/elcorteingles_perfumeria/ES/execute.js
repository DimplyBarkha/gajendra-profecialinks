
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    domain: 'elcorteingles.es',
    loadedSelector: 'a.product_detail-brand',
    noResultsXPath: '//div[contains(@class,"artwork image")] | //p[contains(@class,"explain") and contains(text(),"no responde en este momento")] | //div[contains(@class,"products_list-info")][contains(.,"0 resultados en todo el catálogo")] | //div[contains(@class,"products_list-container")][contains(.,"Lo sentimos, no hemos encontrado productos que coincidan con tu búsqueda.")]',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    let { url, id, zipcode, storeId } = inputs;
    if (!url) {
      if (!id) {
        throw new Error('no id provided');
      }
      url = await dependencies.createUrl({ id });
    }
    await dependencies.goto({ url, zipcode, storeId });
  
    let pageHasResults = false; 
    
    if(parameters.loadedSelector) {
      console.log('need to check if page has results or not', parameters.loadedSelector);
      let pageHasLoaded = false;
      try {
        await context.waitForSelector(parameters.loadedSelector);
        pageHasLoaded = true;
      } catch(err) {
        console.log('we got some error while loading!', err.message);
        try {
          console.log('waiting again');
          await context.waitForSelector(parameters.loadedSelector);
          pageHasLoaded = true;
        } catch(err) {
          console.log('we got some error while loading! -- again', err.message);
        }
      }
      if(pageHasLoaded) {
        console.log('page has seem to have loaded!');
        pageHasResults = await context.evaluate(async (sel) => {
          let loadedElm = document.querySelector(sel);
          if(loadedElm) {
            return true;
          }
          return false;
        },
        parameters.loadedSelector);
      }
    }
  
    // TODO: Check for not found?
    if(!pageHasResults && parameters.noResultsXPath) {
      console.log('need to check for no-results xpath', parameters.noResultsXPath);
      pageHasResults = await context.evaluate(async (noResultsXPath) => {
        let noResutlsELlm = document.evaluate(noResultsXPath, document, null, 7, null);
        if(noResutlsELlm && (noResutlsELlm.snapshotLength > 0)) {
          return false;
        }
        return true;
      }, 
      parameters.noResultsXPath);
      
    }
    return pageHasResults;
  }
};
