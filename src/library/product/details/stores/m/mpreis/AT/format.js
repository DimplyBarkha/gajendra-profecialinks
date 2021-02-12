/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const cleanUp = (data, context) => {
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
            if(el.text){
                el.text = clean(el.text);
            }
        }))));
        return data;
    };    
    function formatNutrition(str = '', matchWord = ''){
        const firstReg = new RegExp(`${matchWord}?. .*?\\s`, 'gmi');
        const secondReg = new RegExp(`${matchWord}?. `, 'gmi');
        return str
        .match(firstReg)[0]
        .replace(secondReg, '')
        .replace(/\s/gm, '');
    }

    for (const { group } of data) {
        for (let row of group) { 
            if (row.category && row.category.length) {
              row.category.shift();
            } 
            if (row.servingSize) {
                if(row.servingSize[0].text.match(/Menge?. .*?\s/gm)){
                    row.servingSize[0].text = formatNutrition(row.servingSize[0].text, 'Menge');
                    row.servingSizeUom = [{text: row.servingSize[0].text.match(/[a-zA-z]+$/gmi)}];
                    row.servingSize[0].text = row.servingSize[0].text.replace(/[a-zA-z]+$/gmi, '');

                } else {
                    row.servingSize[0].text = '';
                }
            }
            if (row.totalFatPerServing) {
                if(row.totalFatPerServing[0].text.match(/Fett?. .*?\s/gm)){
                    row.totalFatPerServing[0].text = formatNutrition(row.totalFatPerServing[0].text, 'Fett');
                    row.totalFatPerServingUom = [{text: row.totalFatPerServing[0].text.match(/[a-zA-z]+$/gmi)}];
                    row.totalFatPerServing[0].text = row.totalFatPerServing[0].text.replace(/[a-zA-z]+$/gmi, '');

                } else {
                    row.totalFatPerServing[0].text = '';
                }
            }
            if (row.saturatedFatPerServing) {
                if(row.saturatedFatPerServing[0].text.match(/Fettsäuren?. .*?\s/gm)){
                    row.saturatedFatPerServing[0].text = formatNutrition(row.saturatedFatPerServing[0].text, 'Fettsäuren');
                    row.saturatedFatPerServingUom = [{text: row.saturatedFatPerServing[0].text.match(/[a-zA-z]+$/gmi)}];
                    row.saturatedFatPerServing[0].text = row.saturatedFatPerServing[0].text.replace(/[a-zA-z]+$/gmi, '');

                } else {
                    row.saturatedFatPerServing[0].text = '';
                }
            }
            if (row.totalCarbPerServing) {
                if(row.totalCarbPerServing[0].text.match(/Kohlenhydrate?. .*?\s/gm)){
                    row.totalCarbPerServing[0].text = formatNutrition(row.totalCarbPerServing[0].text, 'Kohlenhydrate');
                    row.totalCarbPerServingUom = [{text: row.totalCarbPerServing[0].text.match(/[a-zA-z]+$/gmi)}];
                    row.totalCarbPerServing[0].text = row.totalCarbPerServing[0].text.replace(/[a-zA-z]+$/gmi, '');

                } else {
                    row.totalCarbPerServing[0].text = '';
                }
            }
            if (row.dietaryFibrePerServing) {
                if(row.dietaryFibrePerServing[0].text.match(/Ballaststoffe?. .*?\s/gm)){
                    row.dietaryFibrePerServing[0].text = formatNutrition(row.dietaryFibrePerServing[0].text, 'Ballaststoffe');
                    row.dietaryFibrePerServingUom = [{text: row.dietaryFibrePerServing[0].text.match(/[a-zA-z]+$/gmi)}];
                    row.dietaryFibrePerServing[0].text = row.dietaryFibrePerServing[0].text.replace(/[a-zA-z]+$/gmi, '');

                } else {
                    row.dietaryFibrePerServing[0].text = '';
                }
            }
            if (row.totalSugarsPerServing) {
                if(row.totalSugarsPerServing[0].text.match(/Zucker?. .*?\s/gm)){
                    row.totalSugarsPerServing[0].text = formatNutrition(row.totalSugarsPerServing[0].text, 'Zucker');
                    row.totalSugarsPerServingUom = [{text: row.totalSugarsPerServing[0].text.match(/[a-zA-z]+$/gmi)}];
                    row.totalSugarsPerServing[0].text = row.totalSugarsPerServing[0].text.replace(/[a-zA-z]+$/gmi, '');

                } else {
                    row.totalSugarsPerServing[0].text = '';
                }
            }
            if (row.proteinPerServing) {
                if(row.proteinPerServing[0].text.match(/Eiweiß?. .*?\s/gm)){
                    row.proteinPerServing[0].text = formatNutrition(row.proteinPerServing[0].text, 'Eiweiß');
                    row.proteinPerServingUom = [{text: row.proteinPerServing[0].text.match(/[a-zA-z]+$/gmi)}];
                    row.proteinPerServing[0].text = row.proteinPerServing[0].text.replace(/[a-zA-z]+$/gmi, '');

                } else {
                    row.proteinPerServing[0].text = '';
                }
            }
            if (row.saltPerServing) {
                if(row.saltPerServing[0].text.match(/Salz?. .*?\s/gm)){
                    row.saltPerServing[0].text = formatNutrition(row.saltPerServing[0].text, 'Salz');
                    row.saltPerServingUom = [{text: row.saltPerServing[0].text.match(/[a-zA-z]+$/gmi)}];
                    row.saltPerServing[0].text = row.saltPerServing[0].text.replace(/[a-zA-z]+$/gmi, '');

                } else {
                    row.saltPerServing[0].text = '';
                }
            }
            if (row.caloriesPerServing) {
                if(row.caloriesPerServing[0].text.match(/Energie?. .*?\s.*?\s.*?\s/gm)){
                    row.caloriesPerServing[0].text = row.caloriesPerServing[0].text
                    .match(/Energie?. .*?\s.*?\s.*?\s/gm)[0]
                    .replace(/Energie /gm, '');
                    row.caloriesPerServingUom = [{text: row.caloriesPerServing[0].text.match(/[a-zA-z]+$/gmi)}]
                } else {
                    row.caloriesPerServing[0].text = '';
                }
            }
            if(row.pricePerUnit) {
                if(row.pricePerUnit[0].text.match(/\| .+ €/)){
                    let rowText = row.pricePerUnit[0].text.match(/\| .+ €/gm)[0].replace(/\|/gm, '');
                    row.pricePerUnitUom = [{text: row.pricePerUnit[0].text.match(/€\/\w+/gm)[0].replace(/€\//, '')}];
                    rowText = rowText.trim().replace(/ .*/gm, '').replace(/,/, '.');
                    row.pricePerUnit[0].text = rowText;
                }
            }
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };