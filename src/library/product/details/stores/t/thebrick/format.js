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

  for (const { group } of data) {
    for (const row of group) {
      if (row.dimensionsSpecifications) {
        row.dimensionsSpecifications.forEach(item => {
          item.text = item.text.replace(/\n/g, ' ').replace(/\)/g, ') || ')
        })
      }
      if (row.warranty) {
        row.warranty.forEach(item => {
          item.text = item.text.replace(/\n\s*\n*/g, ' ')
        })
      }
      if (row.shippingH) {
        row.shippingH.forEach(item => {
          item.text = 'Height: ' + item.text.replace(/-/g, '.') + '" || '
        })
      }
      if (row.shippingD) {
        row.shippingD.forEach(item => {
          item.text = 'Depth: ' + item.text.replace(/-/g, '.') + '" '
        })
      }
      if (row.shippingW) {
        row.shippingW.forEach(item => {
          item.text = 'Width: ' + item.text.replace(/-/g, '.') + '" || '
        })
      }
      if (row.shippingH && row.shippingD && row.shippingW) {
        const dimension = row.shippingW[0].text + row.shippingH[0].text + row.shippingD[0].text
        row.shippingDimensions = [{ text: dimension }]
      }

      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach(item => {
          item.text = item.text.replace(/\n \n/g, ' || ')
        })
      }
      if (row.description) {
        row.description = row.description.length === 2 ? row.description.slice(1) : row.description
        row.description.forEach(item => {
          item.text = item.text.replace(/Product Description\n/, '')
        })
      }
      if (row.extendedDescritption) {
        row.extendedDescritption.forEach(item => {
          item.text = item.text.replace(/\n \n \n \n \n \n \n \n \n/g, ' || ').replace(/\n \n \n \n \n \n \n/g, ' || ').replace(/\n \n \n \n \n/g, ' || ').replace(/\n \n \n \n/g, ' : ').replace(/\n \n/g, ' || ').replace(/\n/g, ' ').replace(/\s+/g, ' ')
        })
        row.description[0].text += row.dimensionsSpecifications ? ' | ' + row.dimensionsSpecifications[0].text + ' ' + row.extendedDescritption[0].text :
          ' | ' + row.extendedDescritption[0].text
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n \n/g, ' || ')
        })
      }
      if (row.termsAndConditions) {
        row.termsAndConditions[0].text = 'Yes'
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/ /g, '')
        })
      }
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          item.text = item.text.replace(/-/g, '.')
        })
      }
      if (!row.gtin) {
        if (row.upc) {
          row.gtin = row.upc
        }
      }
      if (!row.brandText) {
        row.brandText = row.brandAlt
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
