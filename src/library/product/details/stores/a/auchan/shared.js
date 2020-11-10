/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.manufacturer) {
        row.manufacturer[0].text = row.manufacturer[0].text.split(',')[0];
      }
      if (row.description) {
        row.description[0].text = row.description[0].text.trim();
      }
      if (row.totalFatPerServing) {
        row.totalFatPerServing[0].text = row.totalFatPerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.totalFatPerServingUom) {
        row.totalFatPerServingUom[0].text = row.totalFatPerServingUom[0].text.match(/(g)/g)[0];
      }
      if (row.saturatedFatPerServing) {
        row.saturatedFatPerServing[0].text = row.saturatedFatPerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.saturatedFatPerServingUom) {
        row.saturatedFatPerServingUom[0].text = row.saturatedFatPerServingUom[0].text.match(/(g)/g)[0];
      }
      if (row.totalCarbPerServing) {
        row.totalCarbPerServing[0].text = row.totalCarbPerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.totalCarbPerServingUom) {
        row.totalCarbPerServingUom[0].text = row.totalCarbPerServingUom[0].text.match(/(g)/g)[0];
      }
      if (row.dietaryFibrePerServing) {
        row.dietaryFibrePerServing[0].text = row.dietaryFibrePerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.dietaryFibrePerServingUom) {
        row.dietaryFibrePerServingUom[0].text = row.dietaryFibrePerServingUom[0].text.match(/(g)/g)[0];
      }
      if (row.totalSugarsPerServing) {
        row.totalSugarsPerServing[0].text = row.totalSugarsPerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.totalSugarsPerServingUom) {
        row.totalSugarsPerServingUom[0].text = row.totalSugarsPerServingUom[0].text.match(/(g)/g)[0];
      }
      if (row.vitaminAPerServing) {
        row.vitaminAPerServing[0].text = row.vitaminAPerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.vitaminAPerServingUom) {
        row.vitaminAPerServingUom[0].text = row.vitaminAPerServingUom[0].text.match(/(mcg)/g)[0];
      }
      if (row.vitaminCPerServing) {
        row.vitaminCPerServing[0].text = row.vitaminCPerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.vitaminCPerServingUom) {
        row.vitaminCPerServingUom[0].text = row.vitaminCPerServingUom[0].text.match(/(mg)/g)[0];
      }
      if (row.calciumPerServing) {
        row.calciumPerServing[0].text = row.calciumPerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.calciumPerServingUom) {
        row.calciumPerServingUom[0].text = row.calciumPerServingUom[0].text.match(/(mg)/g)[0];
      }
      if (row.ironPerServing) {
        row.ironPerServing[0].text = row.ironPerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.ironPerServingUom) {
        row.ironPerServingUom[0].text = row.ironPerServingUom[0].text.match(/(mg)/g)[0];
      }
      if (row.saltPerServing) {
        row.saltPerServing[0].text = row.saltPerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.saltPerServingUom) {
        row.saltPerServingUom[0].text = row.saltPerServingUom[0].text.match(/(g)/g)[0];
      }
      if (row.proteinPerServing) {
        row.proteinPerServing[0].text = row.proteinPerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.proteinPerServingUom) {
        row.proteinPerServingUom[0].text = row.proteinPerServingUom[0].text.match(/(g)/g)[0];
      }
      if (row.magnesiumPerServing) {
        row.magnesiumPerServing[0].text = row.magnesiumPerServing[0].text.match(/(\d+)(.)(\d+)/g)[0];
      }
      if (row.magnesiumPerServingUom) {
        row.magnesiumPerServingUom[0].text = row.magnesiumPerServingUom[0].text.match(/(mg)/g)[0];
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
