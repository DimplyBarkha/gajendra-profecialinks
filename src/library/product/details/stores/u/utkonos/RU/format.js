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
            el.text = clean(el.text);
        }))));
        return data;
    };
    for (const { group } of data) {
        for (let row of group) { 
            if (row.description) {
                let info = [];
                row.description.forEach(item => {
                    info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
                });
                row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
            }
            if (row.availabilityText) {
                row.availabilityText.forEach(item => {
                  if(item.text == "В корзину"){
                    item.text = "In stock";
                  }else{
                    item.text = "Out of stock";
                  }
                });          
            }
            if (row.aggregateRating) {
              row.aggregateRating.forEach(item => {
                item.text = item.text + ".o";
              });          
            }
            // if (row.price) {                    
            //   row.price.forEach(item => {
            //     item.text = item.text.replace(',', '.').trim();
            //   });
            // }
            if (row.listPrice) {                    
              row.listPrice.forEach(item => {
                item.text = item.text.replace(',', '.').trim();
              });
            }
            if (row.calciumPerServing) {                    
              row.calciumPerServing.forEach(item => {
                item.text = item.text.substr(item.text.indexOf(" кальций"));
                item.text = item.text.substr(0, item.text.indexOf(","));
                item.text = item.text.replace(' кальций ', '').trim();
                item.text = item.text.replace(/[^\d-]/g, "");
              });
            }
            if (row.caloriesPerServing) {                    
              row.caloriesPerServing.forEach(item => {
                item.text = item.text.substr(item.text.indexOf("Энергетическая ценность"));
                item.text = item.text.substr(0, item.text.indexOf("."));
                //item.text = item.text.substr(0, item.text.indexOf(","));
                item.text = item.text.replace('Энергетическая ценность', '').trim();
                item.text = item.text.replace(/[^\d-/,]/g, "");
              });
            }
            if (row.dietaryFibrePerServing) {                    
              row.dietaryFibrePerServing.forEach(item => {
                item.text = item.text.substr(item.text.indexOf(" клетчатка"));
                item.text = item.text.substr(0, item.text.indexOf(","));
                item.text = item.text.replace(' клетчатка ', '').trim();
                //item.text = item.text.replace(/[^\d-]/g, "");
              });
            }
            if (row.directions) {                    
              row.directions.forEach(item => {
                item.text = item.text.substr(item.text.indexOf(" Информация о приготовлении"));
                //item.text = item.text.substr(0, item.text.indexOf(","));
                item.text = item.text.replace('  Информация о приготовлении:', '').trim();
              });
            }
            if (row.proteinPerServing) {                    
              row.proteinPerServing.forEach(item => {
                if(item.text.indexOf(" белок") !== -1){
                  item.text = item.text.substr(item.text.indexOf(" белок"));
                  item.text = item.text.replace(" белок ", "");
                }else{
                  item.text = item.text.substr(item.text.indexOf(" белки"));
                  item.text = item.text.replace(" белки ", "");
                }
                item.text = item.text.substr(0, 4);
                item.text = item.text.replace(/[^\d-,]/g, "");
                item.text = item.text.replace(/[^\d.,]/g, "");
              });
            }
            if (row.ingredientsList) {                    
              row.ingredientsList.forEach(item => {
                item.text = item.text.substr(item.text.indexOf("Состав"));
                item.text = item.text.substr(0, item.text.indexOf("."));
                item.text = item.text.replace("Состав: ", "");
              });
            }
            if (row.totalFatPerServing) {                    
              row.totalFatPerServing.forEach(item => {
                item.text = item.text.substr(item.text.indexOf("жиры"));
                item.text = item.text.substr(0, item.text.indexOf(";"));
                item.text = item.text.replace('жиры', '').trim();
                item.text = item.text.replace(/[^\d,]/g, "");
              });
            }
            if (row.totalCarbPerServing) {                    
              row.totalCarbPerServing.forEach(item => {
                item.text = item.text.substr(item.text.indexOf("углеводы"));
                item.text = item.text.replace('углеводы', '').trim();
                item.text = item.text.substr(0, item.text.indexOf("г"));
                item.text = item.text.replace(/[^\d,]/g, "");
              });
            }
            if (row.sodiumPerServing) {                    
              row.sodiumPerServing.forEach(item => {
                item.text = item.text.substr(item.text.indexOf("натрий"));
                //item.text = item.text.replace('натрий', '').trim();
                item.text = item.text.substr(0, item.text.indexOf("."));
                item.text = item.text.replace(/[^\d,]/g, "");
              });
            }
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
