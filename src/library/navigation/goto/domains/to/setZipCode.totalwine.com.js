
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'totalwine.com',
    store: 'total_wine_95825',
    zipcode: "95825",
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    await context.evaluate(async (context) => {
      const clickForLocationSidebar = document.querySelector('p[data-at="shoppingMethod"]');
      if (clickForLocationSidebar) {
        clickForLocationSidebar.click();
      }
      await new Promise((resolve) => { setTimeout(resolve, 30000) })
      const setZipcode = document.querySelector('input[class="Inputstyled__Input-sc-11h42ry-0 cUsZpS"]');
      if (setZipcode) {
        setZipcode.value = "95825";
      }
      try {
        await context.waitForSelector('button.buttonstyled__Button-sc-1t8li5e-0.hCqwhf', { timeout: 50000 });
        console.log('search button loaded successfully');
      } catch (e) {
        console.log('not able to load the searchbutton');
      }
      const searchButton = document.querySelector('button.buttonstyled__Button-sc-1t8li5e-0.hCqwhf');
      if (searchButton) {
        searchButton.click();
        // await context.click('button.buttonstyled__Button-sc-1t8li5e-0.hCqwhf');
        console.log('able to click the search button')
      }
      else {
        console.log('not able to click the button')
      }
      await new Promise((resolve) => { setTimeout(resolve, 30000) })
      const zipcodes = document.querySelectorAll('p[class="addressLine__1TYNZEmZ"]');
      if (zipcodes.length) {
        zipcodes.forEach((elem) => {
          if (elem.innerText.includes("95825")) {
            const parentDiv = elem.parentElement.parentElement.parentElement.parentElement;
            const clickButton = parentDiv.querySelector('button[data-kind="primary"]');
            clickButton.click();
          }
        })
      }
      await new Promise((resolve) => { setTimeout(resolve, 30000) })
    }, context);
  },
};
