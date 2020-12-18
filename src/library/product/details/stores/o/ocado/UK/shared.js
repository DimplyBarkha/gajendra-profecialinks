
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const nutritionalProps = ['totalFatPerServing', 'saturatedFatPerServing', 'totalCarbPerServing', 'sodiumPerServing', 'dietaryFibrePerServing', 'totalSugarsPerServing', 'proteinPerServing', 'vitaminAPerServing', 'vitaminCPerServing', 'calciumPerServing', 'ironPerServing', 'saltPerServing'];

  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let bulletCount = 0;
        let text = '';
        row.description.forEach(item => {
          if (item.text.match(/^- (.+)/)) {
            text += `|| ${item.text.match(/^- (.+)/)[1]} `;
            bulletCount++;
          } else {
            text += `${item.text} `;
          }
        });
        row.description = [{ text: text.trim() }];
        row.descriptionBullets = [{ text: bulletCount }];
      }
      if(row.nameExtended){
        let nameExtended =''
        nameExtended = nameExtended.replace(/[0-9]/g, '');
        console.log('here is product name',nameExtended);
      }

      if (row.manufacturer) {
        let text = '';
        row.manufacturer.forEach(item => {
          text += `${item.text} `;
        });
        row.manufacturer = [{ text: text.trim() }];
      }

      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text += `${item.text} `;
        });
        row.directions = [{ text: text.trim() }];
      }

      if (row.warnings) {
        let text = '';
        let warningExists = false;
        for (let i = 0; i < row.warnings.length; i++) {
          if (row.warnings[i].text.match(/safety warning/i)) {
            warningExists = true;
            continue;
          }

          if (row.warnings[i].text.match(/Origin:/i)) {
            break;
          }

          if (warningExists) {
            text += `${row.warnings[i].text} `;
          }
        }
        row.warnings = [{ text: text.trim() }];
      }

      if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach(item => {
          text += `${item.text} `;
        });
        row.productOtherInformation = [{ text: text.trim() }];
      }

      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text += `${item.text} `;
        });
        row.promotion = [{ text: text.trim() }];
      }

      // @TODO - Nutritional transform functions
      if (row.servingSize) {
        let servingSize = row.servingSize[0].text;
        console.log('Serving size');
        if (servingSize.match(/(\d+)(g|mg|ml|Mg|Ml)/)) {
          row.servingSizeUom = [{ text: servingSize.match(/(\d+)(g|mg|ml|Mg|Ml)/)[2] }];
          servingSize = servingSize.replace(servingSize.match(/(\d+)(g|mg|ml|Mg|Ml)/)[0], servingSize.match(/(\d+)(g|mg|ml|Mg|Ml)/)[1]);
          row.servingSize = [{ text: servingSize }];
        } else if (servingSize.match(/(g|mg|Mg|ml|Ml)\/(ml|Ml|l|L|litre)/)) {
          row.servingSize = [{ text: '' }];
          row.servingSizeUom = [{ text: servingSize.match(/(g|mg|Mg|ml|Ml)\/(ml|Ml|l|L|litre)/)[0] }];
        } else if (servingSize.match(/analytical constituents(.+)%/i)) {
          row.servingSize = [{ text: '' }];

          row.servingSizeUom = [{ text: '%' }];
        } else {
          row.servingSize = [{ text: '' }];
          row.servingSizeUom = [{ text: '' }];
        }
      }

      if (row.caloriesPerServing && row.caloriesPerServing.length === 2) {
        row.caloriesPerServing = [
          {
            text: `${row.caloriesPerServing[0].text}/${row.caloriesPerServing[1].text}`,
          },
        ];
      }

      for (let i = 0; i < nutritionalProps.length; i++) {
        const nutritionalProp = nutritionalProps[i];
        if (row[nutritionalProp]) {
          console.log('Nutri props - ' + nutritionalProp);
          // Match with regExp
          if (row[nutritionalProp][0].text.match(/([a-zA-Z]+\s[a-zA-Z]+)?(<?)\s?(\d+(\.\d+)?)\s?(g|mg|ml|%|IU|Mg|Ml|litre|L)/)) {
            let text = '';
            const matchArr = row[nutritionalProp][0].text.match(/([a-zA-Z]+\s[a-zA-Z]+)?(<?)\s?(\d+(\.\d+)?)\s?(g|mg|ml|%|IU|Mg|Ml|litre|L)/);
            for (let i = 1; i < 4; i++) {
              if (matchArr[i]) {
                text += `${matchArr[i]} `;
              }
            }
            row[`${nutritionalProp}Uom`] = [{ text: matchArr[5] }];
            row[nutritionalProp] = [{ text: text.trim() }];
          } else if (row[nutritionalProp][0].text.match(/(^\d+(,\d+)?)\s?(g|mg|ml|%|IU|Mg|Ml|litre|L)/)) {
            row[`${nutritionalProp}Uom`] = [{ text: row[nutritionalProp][0].text.match(/(^\d+(,\d+)?)\s?(g|mg|ml|%|IU|Mg|Ml|litre|L)/)[3] }];
            row[nutritionalProp] = [{ text: row[nutritionalProp][0].text.match(/(^\d+(,\d+)?)\s?(g|mg|ml|%|IU|Mg|Ml|litre|L)/)[1] }];
          } else if (row[nutritionalProp][0].text.match(/trace?|nil?/i)) {
            row[`${nutritionalProp}Uom`] = [{ text: '' }];
          } else {
            row[`${nutritionalProp}Uom`] = [{ text: row.servingSizeUom[0].text }];
          }
        }
      }

      if (row.pricePerUnit) {
        if (row.pricePerUnit[0].text.match(/(.+)\s?per\s?(.+)/i)) {
          row.pricePerUnitUom = [{ text: row.pricePerUnit[0].text.match(/(.+)\s?per\s?(.+)/i)[2] }];
          row.pricePerUnit = [{ text: row.pricePerUnit[0].text.match(/(.+)\s?per\s?(.+)/i)[1].trim() }];
        } else if (row.pricePerUnit[0].text.match(/(\d+(\.\d+)?)([a-zA-Z])\s?(.+)/)) {
          const matchArr = row.pricePerUnit[0].text.match(/(\d+(\.\d+)?)([a-zA-Z])\s?(.+)/);
          row.pricePerUnit = [{ text: `${matchArr[1]} ${matchArr[3]}` }];
          row.pricePerUnitUom = [{ text: `${matchArr[4]}` }];
        }
      }
    }
  }

  // Clean up data
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

module.exports = { transform };
