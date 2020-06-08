/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id } = inputs;
  await context.goto("https://www.kroger.com");


  async function getCurrentZip() {
    return await context.evaluate(async function() {
      var element = document.querySelector('span[data-testid="CurrentModality-vanityName"]');
      if( element != null ) {
        return element.textContent;
      }
      return null;
    });
  }

  
  async function findButtonWithStoreSelect() {
    await context.evaluate(function() {
      var buttons = document.querySelectorAll("button");
      for( var i = 0; i<buttons.length; i++ ) {
        var button = buttons[i];
        if( button.textContent == "Select Store") {
          console.log("Found Button");
          button.click();
          return;
        }
      }
    });
  }

  async function findClosestStore() {
    let ixToClick = await context.evaluate(async function() {
      var sections = document.querySelectorAll("div.ModalitySelector--StoreSearchResult");
      var smallest_distance = 999;
      var smallest_section = null;
      var smallest_ix = null;
      for( var i = 0; i<sections.length; i++ ) {
        var section = sections[i].querySelector("div.ModalitySelector--StoreSearchResultAddress > div > div");
        if( section != null ) {
          var distance = parseFloat(section.textContent);
          if( distance < smallest_distance ) {
            smallest_distance = distance;
            smallest_section = section;
            smallest_ix = i+1;
          }
        }
        console.log(section.textContent);
      }
      console.log("Closest store: " + smallest_distance);
      return smallest_ix;
     
      /*
      var store_clicker = smallest_section.parentNode.parentNode.parentNode.querySelector("div.StoreSearchResults-StartButton a");
      if( store_clicker != null ) {
        console.log("clicking");
        store_clicker.click();
      }
      else {
        console.log("could not click");
      }
      */
    });
    await context.click(`div.ModalitySelector--StoreSearchResult:nth-of-type(${ixToClick}) div.StoreSearchResults-StartButton`);
  }

  async function changeZip(wantedZip) {
    await context.click("button.CurrentModality-button");
    //var button = document.querySelector("button.CurrentModality-button");
    //button.click();
    await new Promise(r => setTimeout(r, 10e3));
    //var input = document.querySelector("input[autocomplete='postal-code']");
    //input.click();
    //input.value = "94114";
    //input.dispatchEvent(new Event('change', { 'bubbles': true }));
    await context.setInputValue("input[autocomplete='postal-code']", wantedZip);
    await new Promise(r => setTimeout(r, 3e3));
    await context.click("button.kds-SolitarySearch-button");
    await new Promise(r => setTimeout(r, 3e3));
    await findButtonWithStoreSelect();
    await new Promise(r => setTimeout(r, 3e3));
    await findClosestStore();
    await new Promise(r => setTimeout(r, 3e3));
    //var submit_button = document.querySelector("button.kds-SolitarySearch-button");
    //submit_button.click();
  }

  let wantedZip = "45209"
  let currentZip = await getCurrentZip();
  console.log("Want zip: " + wantedZip + " got zip: " + currentZip);

  if( currentZip != wantedZip ) {
    console.log("Trying to change zip");
    await changeZip(wantedZip);
  }

  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url });


  // TODO: Check for not found?
}

module.exports = {
  implements: 'product/details/execute',
  dependencies: {
    goto: 'action:navigation/goto',
    createUrl: 'action:product/details/createUrl',
  },
  parameterValues: {
    country: 'US',
    store: 'kroger',
    domain: 'kroger.com',
  },
  implementation
};
