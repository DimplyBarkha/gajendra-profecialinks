/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data, context) => {
    const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    for (const { group } of data) {
      for (const row of group) {
        // Variants
        console.log(row);
        if (row.variants) {
          const variantArray = row.variants.map((item) => {
            return item.text;
          });
          clean(row.variants = [{ text: variantArray.join(' | '), xpath: row.variants[0].xpath }]);
        }
        // VariantCount
        if (row.variantCount) {
          const variantCountArr = row.variantCount.map((item) => {
            return item.text;
          });
          clean(row.variantCount = [{ text: variantCountArr.length, xpath: row.variantCount[0].xpath }]);
        }
        // AlternateImages
        if (row.alternateImages) {
          const alternateImagesArr = row.alternateImages.map((item) => {
            return item.text;
          });
          alternateImagesArr.shift();
          clean(row.alternateImages = [{ text: alternateImagesArr.join(' | '), xpath: row.alternateImages[0].xpath }]);
        }
     
        // NameExtended
        if (row.nameExtended) {
          let brandName     = (row.nameExtended[1] && typeof row.nameExtended[1] !== 'undefined' )?row.nameExtended[1].text:'';
          let productSize   = (row.nameExtended[2] && typeof row.nameExtended[2] !== 'undefined' )?row.nameExtended[2].text:'';
          row.nameExtended[0].text  = brandName +' '+ row.nameExtended[0].text +' '+ productSize;
          row.nameExtended = [{
            text : row.nameExtended[0].text.trim(),
            xpath : row.nameExtended[0].xpath
          }]
        }
        // Price
        if (row.listPrice && row.listPrice[0]) {
          clean(row.listPrice[0].text = row.listPrice[0].text.replace(/,/g, '.'));
        }
        // IngredientsList
        if (row.ingredientsList && row.ingredientsList[0]) {
          clean(row.ingredientsList[0].text = row.ingredientsList[0].text.replace(/\\n\\n/gm, ''));
          clean(row.ingredientsList[0].text = row.ingredientsList[0].text.replace(/\\n/gm, ''));
          clean(row.ingredientsList[0].text = row.ingredientsList[0].text.replace(/\"/gm, ''));
        }
        // Directions
        if (row.directions && row.directions[0]) {
          row.directions[0].text = row.directions[0].text.replace(/\\n/gm, '');
          row.directions[0].text = row.directions[0].text.replace('<br>', '');
        }
        // Description
        if (row.description) {
          const descriptionArr = row.description.map((item) => {
            return typeof (item.text) === 'string' ? item.text.replace(/\n /gm, '') : ' | ';
          });
          clean(row.description = [{ text: descriptionArr.join(' '), xpath: row.description[0].xpath }]);
        }
        // Variant Information
        if (row.variantInformation) {
          const variantInformationArr = row.variantInformation.map((item) => {
            return typeof (item.text) === 'string' ? item.text.replace(/\n \n/gm, ' ') : ' ';
          });
          clean(row.variantInformation = [{ text: variantInformationArr.join(' '), xpath: row.variantInformation[0].xpath }]);
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };