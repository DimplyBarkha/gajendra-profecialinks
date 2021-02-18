const { cleanUp } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
    const { cleanUp } = parameters;
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function findLabel (productObj, label) {
        const value = productObj[label];
        if (Array.isArray(value)) {
          return {
            label: value.reduce((prevVal, currentVal) => {
              return (prevVal) ? prevVal + ',' + currentVal : currentVal;
            }, ''),
          };
        } else if (value) {
          return { label: value };
        }
        return null;
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function findAndInsertLabel (obj, labelName, outputName) {
        const result = findLabel(obj, labelName);
        if (result != null) {
          addHiddenDiv('ii_' + outputName, result.label);
        }
      }


      const price = document.querySelectorAll('p.price > span');
        if(price.length > 1)
        {
          var price1 = price[1].innerText;
          console.log(price1)
	        addHiddenDiv('ii_price', price1);
          
        }
        else{
	        var price2 = price[0].innerText;
          console.log(price2)
          addHiddenDiv('ii_price', price2);
          
        }
        
       
      
        const aggrRating= getElementByXpath('//div[@class="rateyo-readonly jq-ry-container"]/@data-rating');
        if(aggrRating)
        {
          const ratingValue=aggrRating.textContent;
          if(ratingValue!=0)
          {
            const aggregateRating = ratingValue.replace('.',',');
            console.log(aggregateRating+"//////////////");
            addHiddenDiv('ii_aggregateRating', aggregateRating);
          }
        }



      function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
        const description = getElementByXpath("//div[contains(@id,'tab-productDescription')]");
        const nutrition = getElementByXpath("//div[contains(@id,'tab-nutritionalinformation')]");
      
      if(description!=null || nutrition!=null)
      {
        if(description==null)
        {
          var completeDescription = nutrition.innerText;
          console.log(completeDescription);
          const description1 = completeDescription.toString().replace(/\n|\r/g, ' ');
          console.log(description1)
          // const description1 = description.innerText.toString().replace(/\n|\r/g, ' ');
          addHiddenDiv('ii_description', description1);
        }
        else if(nutrition==null)
        {
          var completeDescription = description.innerText;
          console.log(completeDescription);
          const description1 = completeDescription.toString().replace(/\n|\r/g, ' ');
          console.log(description1)
          // const description1 = description.innerText.toString().replace(/\n|\r/g, ' ');
          addHiddenDiv('ii_description', description1);
        }
        else 
        {
          console.log(description.innerText+" ./././.././.");
          console.log(nutrition.innerText+" ./././.././.");
          var completeDescription = description.innerText.concat(nutrition.innerText);
          console.log(completeDescription);
          const description1 = completeDescription.toString().replace(/\n|\r/g, ' ');
          console.log(description1)
          // const description1 = description.innerText.toString().replace(/\n|\r/g, ' ');
          addHiddenDiv('ii_description', description1);

        }
        // var completeDescription = concat(description,nutrition);
        // console.log(completeDescription+" ./././")
        

      }

      const quantity= getElementByXpath("//*[contains(text(),'CANTIDAD NETA')]/following-sibling::*");
      if(quantity)
      {
        const size=quantity.innerText.toString().replace(/\s/g,"");
        console.log(size)
        addHiddenDiv('ii_size', size);
      }

      // var calories = getElementByXpath('//*[contains(text(),"valor energético")]/parent::td[1]/following-sibling::*[1]/div');
      // if(calories)
      // {
      //   const caloriesPerServing = calories.innerText;
      //   console.log(caloriesPerServing+" *******");
      //   // var energy = getElementByXpath('//*[contains(text(),"kJ")]/parent::td[1]/div/text()');
      //   // console.log(energy.innerHTML+" *****")
      // }

      const caloriesInKJ = getElementByXpath('//*[contains(text(),"kJ")]/parent::td[1]/div/text()');
      const caloriesinKcal = getElementByXpath('//*[contains(text(),"Kcal")]/parent::td[1]/div/text()');
      if(caloriesInKJ && caloriesinKcal)
      {
        console.log(caloriesInKJ.textContent+"!!!!!!");
        console.log(caloriesinKcal.textContent+"!!!!!")
        const caloriesInitial = caloriesInKJ.textContent.concat(' ');
        const calories = caloriesInitial.concat(caloriesinKcal.textContent);
        console.log(calories+" /--/--/--/--/--/")
        addHiddenDiv('ii_calories', calories);
      }

      const vitaminCUom = getElementByXpath('//*[contains(text(),"vitamina C")]/parent::td[1]/following-sibling::*[1]');
      if(vitaminCUom)
      {
        const vitaminCUnit = vitaminCUom.innerText;
        console.log(vitaminCUnit);
      }

      // const country = getElementByXpath('//*[contains(text(),"Pais de origen:")]');
      // if(country)
      // {
      //   const countryString= country.innerText.match(/:..(.+)/g);
      //   const countryOfOrigin = countryString.toString().replace(/:..(.+)/g,'$1');
      //   console.log(countryOfOrigin+" *-*--**-*-*-*-*-*-");
      // }

    
      const jsonString = getElementByXpath("/html/body/script[@type='application/ld+json']");
      // const jsonData = document.querySelector('//script[@type="application/ld+json"]').innerHTML;
      // const jsondata1=JSON.parse(jsonData);
      console.log("==================================================")
      console.log(jsonString);
      // if ('brand' in jsonData[0]) {
      //   const brandText = jsonData[0].brand.name;
      //   addElementToDocument('brandText', brandText);
      // }

      const imageZoom = getEleByXpath("//a[@class='productZoom']");
      // const outOfStock = 'Leider ausverkauft';
      const imageZoomPresent = 'Cargando zoom';
      if (imageZoom !== imageZoomPresent) {
        addEleToDoc('imageZoom', 'No');
      } 
      // else {
      //   addEleToDoc('imageZoom', 'No');
      // }

      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
      function getEleByXpath (xpath) {
              const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              console.log('Element' + element);
              const text = element ? element.textContent : null;
              return text;
            }
    });
    return await context.extract(productDetails, { cleanUp });
  }
  


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'dia',
    transform: cleanUp,
    domain: 'dia.es',
    zipcode: '',
  },
  implementation,
  
};
