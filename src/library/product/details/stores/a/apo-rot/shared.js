
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  for (const { group } of data) {
    for (let row of group) {
      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          text += `${item.text.replace(/\./, ',')}`;
        });
        row.aggregateRating = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        let finalDesc = '';
        for (let i = 0; i < row.description.length; i++) {
          if (row.description[i].text.includes('#youtube-player-details') ) {

          }
          else if (row.description[i].xpath.includes('li')) {            
            finalDesc = finalDesc.trim() + ' || ' + row.description[i].text;
          } else {
            finalDesc = finalDesc + row.description[i].text + ' ';
          }

          if (finalDesc.startsWith('||')) {
            finalDesc = finalDesc.substring(2);
          }          
        }
        finalDesc = finalDesc.trim();
        row.description = [
          {
            text: finalDesc,
          },
        ];
      }   

      if (row.directions) {
        let finalDirections = '';
        for (let i = 0; i < row.directions.length; i++) {
         finalDirections = finalDirections + row.directions[i].text;     
        }
        finalDirections = 'Anwendung:' + finalDirections;
        row.directions = [
          {
            text: finalDirections,
          },
        ];
      }

      if (row.ingredientsList && row.ingredientsList.length) {
        let ingredientsParent = row.ingredientsList[0].text;
        let ingredients = '';
        let finalIngredients = '';
        let activeIngredients = '';
        const containsIngredientsRegex = new RegExp(/\b(?:Inhaltsstoffe|Inhaltsstoffe:|Ingredients:|Ingredients)\b/g);
        const containsIngredients = containsIngredientsRegex.test(ingredientsParent);        
        const containsActiveIngredientsRegex = new RegExp("\\b"+"Wirkstoffe:"+"\\b");        
        const containsActiveIngredients = containsActiveIngredientsRegex.test(ingredientsParent);
        if (row.ingredientsList.length > 1) {
          activeIngredients = row.ingredientsList[1].text;
        }         
                     
        if (containsIngredients) {
          ingredients = ingredientsParent.split(containsIngredientsRegex)[1];    
          ingredients ? finalIngredients = 'Inhaltsstoffe' + ingredients  + ' ' + activeIngredients.substr(12, activeIngredients.length)        
          : finalIngredients = activeIngredients.substr(12, activeIngredients.length);

        } else {
          finalIngredients = activeIngredients.substr(12, activeIngredients.length);
        }

        if (containsActiveIngredients)        {
          const aIngredients = ingredientsParent.split(containsActiveIngredientsRegex);          
          finalIngredients = finalIngredients + ' Wirkstoffe' + aIngredients[aIngredients.length - 1];
        }
        finalIngredients = finalIngredients.trim();
        row.ingredientsList = [{text: finalIngredients}];
      }
      
      if (row.variants) {
        var variantsLength = row.variants.length;
        if (variantsLength <= 1) {
          row.variants = [
            {
              text: '',
            },
          ];
          row.firstVariant = [
            {
              text: '',
            },
          ];
        }
      }
      row = clean(row);
    }
  }
  return data;
};

module.exports = { transform };
