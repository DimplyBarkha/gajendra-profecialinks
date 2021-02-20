
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */


const transform = (data) => {
    
    function removeUnit(inputText) {
        let quantity = inputText.replace(/[a-zA-Z]/g, '');                
        quantity = quantity.replace('µ', '');
        return quantity.trim();                
    }
    
    function extractUnit(inputText) {
        let uom = inputText.replace(/[0-9]/g, '');  
        uom = uom.replace(/\,/g, '');    
        uom = uom.replace('<' || '>', '');        
        return uom.trim();                
    }

    for (const { group } of data) {
        for (const row of group) {
            if (row.description) {                
                let text = '';
                row.description.forEach(item => {
                    text += item.text.replace(/\n/g, '');
                });
                row.description = [{ text }];
            }

            let brandName = '';
            if(row.brandText && row.brandText.length){
                brandName = row.brandText[0].text;
                console.log('brandName -->', brandName);
            }

            if (row.imNameExtended) {                
                let text = '';
                row.imNameExtended.forEach(item => {
                    text += item.text.replace(/\n/g, '');
                });
                if (brandName && brandName.length){
                    if (text.includes(brandName)){
                        text = text;
                    }
                    else{
                        text = brandName+" "+text;
                    }
                }
                console.log('imNameExtended -------> ',text);
                row.imNameExtended = [{ text }];
            }


            if (row.directions) {                
                let text = '';
                row.directions.forEach(item => {
                    text += item.text.replace(/\n/g, '');
                });
                row.directions = [{ text }];
            }

            if (row.onlinePriceCurrency && row.onlinePriceCurrency.length) {                
                let currency = row.onlinePriceCurrency[0].text.replace(/[0-9]/g, '');
                currency = currency.trim();
                row.onlinePriceCurrency = [{ text: currency}];
            }

            if (row.proteinPerServing && row.proteinPerServing.length) {
                let quantity = removeUnit(row.proteinPerServing[0].text);                
                row.proteinPerServing = [{ text: quantity }];
            }

            if (row.ironPerServing && row.ironPerServing.length) {
                row.ironPerServing[0].text = removeUnit(row.ironPerServing[0].text);                                
            }

            if (row.magnesiumPerServing && row.magnesiumPerServing.length) {
                row.magnesiumPerServing[0].text = removeUnit(row.magnesiumPerServing[0].text);                                
            }

            if (row.vitaminCPerServing && row.vitaminCPerServing.length) {
                row.vitaminCPerServing[0].text = removeUnit(row.vitaminCPerServing[0].text);                                
            }

            if (row.calciumPerServing && row.calciumPerServing.length) {
                let quantity = row.calciumPerServing[0].text.replace(/[a-zA-Z]/g, '');                
                quantity = quantity.trim();
                row.calciumPerServing = [{ text: quantity }];
            }

            if (row.calciumPerServingUom && row.calciumPerServingUom.length) {
                row.calciumPerServingUom[0].text = extractUnit(row.calciumPerServingUom[0].text);
            }

            if (row.magnesiumPerServingUom && row.magnesiumPerServingUom.length) {
                row.magnesiumPerServingUom[0].text = extractUnit(row.magnesiumPerServingUom[0].text);
            }

            if (row.dietaryFibrePerServingUom && row.dietaryFibrePerServingUom.length) {
                row.dietaryFibrePerServingUom[0].text = extractUnit(row.dietaryFibrePerServingUom[0].text);
            }

            if (row.totalFatPerServingUom && row.totalFatPerServingUom.length) {
                row.totalFatPerServingUom[0].text = extractUnit(row.totalFatPerServingUom[0].text);
            }

            if (row.ironPerServingUom && row.ironPerServingUom.length) {
                row.ironPerServingUom[0].text = extractUnit(row.ironPerServingUom[0].text);
            }

            if (row.saturatedFatPerServingUom && row.saturatedFatPerServingUom.length) {
                row.saturatedFatPerServingUom[0].text = extractUnit(row.saturatedFatPerServingUom[0].text);
            }

            if (row.vitaminAPerServingUom && row.vitaminAPerServingUom.length) {
                row.vitaminAPerServingUom[0].text = extractUnit(row.vitaminAPerServingUom[0].text);
            }

            if (row.totalSugarsPerServingUom && row.totalSugarsPerServingUom.length) {
                row.totalSugarsPerServingUom[0].text = extractUnit(row.totalSugarsPerServingUom[0].text);
            }

            if (row.totalCarbPerServingUom && row.totalCarbPerServingUom.length) {
                row.totalCarbPerServingUom[0].text = extractUnit(row.totalCarbPerServingUom[0].text);
            }

            if (row.proteinPerServingUom && row.proteinPerServingUom.length) {
                row.proteinPerServingUom[0].text = extractUnit(row.proteinPerServingUom[0].text);
            }

            if (row.vitaminCPerServingUom && row.vitaminCPerServingUom.length) {
                row.vitaminCPerServingUom[0].text = extractUnit(row.vitaminCPerServingUom[0].text);
            }

            if (row.pricePerUnitUom && row.pricePerUnitUom.length) {
                let unit = '';
                unit = row.pricePerUnitUom[0].text.split(':')                
                if (unit) {
                    unit = unit[unit.length -1]
                    row.pricePerUnitUom[0].text = extractUnit(unit);
                }                
            }

            if (row.dietaryFibrePerServing && row.dietaryFibrePerServing.length) {
                let quantity = row.dietaryFibrePerServing[0].text.replace(/[a-zA-Z]/g, '');                
                quantity = quantity.trim();
                row.dietaryFibrePerServing = [{ text: quantity }];
            }

            if (row.totalFatPerServing && row.totalFatPerServing.length) {
                let quantity = row.totalFatPerServing[0].text.replace(/[a-zA-Z]/g, '');                
                quantity = quantity.trim();
                row.totalFatPerServing = [{ text: quantity }];
            }

            if (row.totalCarbPerServing && row.totalCarbPerServing.length) {
                let quantity = row.totalCarbPerServing[0].text.replace(/[a-zA-Z]/g, '');                
                quantity = quantity.trim();
                row.totalCarbPerServing = [{ text: quantity }];
            }

            if (row.totalSugarsPerServing && row.totalSugarsPerServing.length) {
                let quantity = row.totalSugarsPerServing[0].text.replace(/[a-zA-Z]/g, '');                
                quantity = quantity.trim();
                row.totalSugarsPerServing = [{ text: quantity }];
            }

            if (row.saturatedFatPerServing && row.saturatedFatPerServing.length) {
                let quantity = row.saturatedFatPerServing[0].text.replace(/[a-zA-Z]/g, '');                
                quantity = quantity.trim();
                row.saturatedFatPerServing = [{ text: quantity }];
            }

            if (row.proteinPerServing && row.proteinPerServing.length) {
                let quantity = row.proteinPerServing[0].text.replace(/[a-zA-Z]/g, '');                
                quantity = quantity.trim();
                row.proteinPerServing = [{ text: quantity }];
            }

            if (row.vitaminAPerServing && row.vitaminAPerServing.length) {
                row.vitaminAPerServing[0].text = removeUnit(row.vitaminAPerServing[0].text);
            }            

            if (row.caloriesPerServing) {
                let text = '';
                row.caloriesPerServing.forEach(item => {
                    text += ' ' + item.text
                });
                text = text.trim();
                row.caloriesPerServing = [{ text }];
            }

            if (row.secondaryImageTotal && row.secondaryImageTotal.length) {
                 if ( row.secondaryImageTotal[0].text  == -1 ) {
                    row.secondaryImageTotal[0].text = '';
                 }
            }

            if (row.promotion && row.promotion.length) {                 
                 let promoCode;
                 let s = row.promotion[0].text.split('.');
                 let d = s[s.length - 2];
                 if (d) {
                     promoCode = d.split('_');
                     if (promoCode) {
                         promoCode = promoCode[promoCode.length - 1];
                         row.promotion[0].text = promoCode
                     } else {
                        row.promotion[0].text = '';
                     }
                 }
            }

            if (row.availabilityText && row.availabilityText.length) {
                row.availabilityText[0].text = row.availabilityText[0].text.split(',')[0];
            }
        }
    }
    return data;
};



module.exports = { transform };
