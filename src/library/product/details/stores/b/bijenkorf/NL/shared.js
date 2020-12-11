
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.name && row.brandText) {
        let nameExtended = `${row.brandText[0].text} - ${row.name[0].text}`;
        if (row.variantInformation) {
          nameExtended = `${nameExtended} - ${row.variantInformation[0].text}`;
        } else if (row.singleProductVariantInformation) {
          nameExtended = `${nameExtended} - ${row.singleProductVariantInformation[0].text}`;
        }
        row.nameExtended = [{ text: nameExtended }];
      }

      if (row.directions) {
        row.directions[0].text = row.directions[0].text.replace('Gebruikstips:', '');
      }

      if (row.specifications) {
        for (let i = 0; i < row.specifications.length; i++) {
          row.specifications[i].text = `| ${row.specifications[i].text}`;
        }
      }

      if (!row.image && row.singleProductimage) {
        row.image = row.singleProductimage;
      }

      if (!row.variantInformation && row.singleProductVariantInformation) {
        row.variantInformation = row.singleProductVariantInformation;
      }

      if (!row.alternateImages && row.singleProductAlternateImages) {
        row.alternateImages = row.singleProductAlternateImages;
      }

      if (!row.sku && row.singleProductsku) {
        row.sku = row.singleProductsku;
      }

      if (row.sku) {
        row.variantId = row.sku;
      }

      if (!row.secondaryImageTotal && row.singleProductSecondaryImageTotal) {
        row.secondaryImageTotal = row.singleProductSecondaryImageTotal;
      }

      if (!row.imageAlt && row.singleProductImageAlt) {
        row.imageAlt = row.singleProductImageAlt;
      }

      if (row.availabilityText && row.availabilityText[0].text === 'Out of stock' && row.singleProdAvailabilityText) {
        row.availabilityText = row.singleProdAvailabilityText;
      }

      row.imageZoomFeaturePresent = [{ text: 'Yes' }];
    }
  }

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
