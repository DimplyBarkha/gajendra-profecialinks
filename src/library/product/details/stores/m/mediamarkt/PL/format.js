/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (text) =>
    text
      .toString()
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
      if (row.description) {
        row.description.forEach((descriptionItem) => {
          descriptionItem.text = cleanUp(descriptionItem.text);
        });
      }

      if (!row.brandText) {
        row.brandText = [{ text: row.name[0].text.replace(/^([\w]+).*/gm, '$1') }];
      }
      if (row.specifications) {
        row.specifications[0].text = row.specifications[0].text
          .replace(/(\n\s*){4,}/g, ' || ')
          .replace(/(\n\s*){2,}/g, ' : ');
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(availabilityTextItem => {
          const availability = availabilityTextItem.text.replace(/.*availability": ?"(.*?)".*/gs, '$1');
          if (availability && availability.toLowerCase().includes('instore' || 'instock')) {
            availabilityTextItem.text = 'In stock';
          } else {
            availabilityTextItem.text = 'Out of stock';
          }
        });
      }
      if (row.image) {
        row.image.forEach(itemText => {
          itemText.text = itemText.text.includes('http') ? itemText.text : 'https:' + itemText.text;
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.includes('http') ? item.text : 'https:' + item.text;
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach((aggregateRatingItem) => {
          aggregateRatingItem.text = aggregateRatingItem.text.replace(/[^0-9.]/g, '');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach((listPriceItem) => {
          listPriceItem.text = listPriceItem.text.replace(/,-/g, '');
        });
      }
      if (row.warranty) {
        row.warranty.forEach((warrantyItem) => {
          warrantyItem.text = warrantyItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.name && row.brandText) {
        row.nameExtended = [
          { text: row.brandText[0].text + ' - ' + row.name[0].text },
        ];
      }
      if (row.ratingCount) {
        row.ratingCount.forEach((ratingCountItem) => {
          ratingCountItem.text = ratingCountItem.text.replace(/[^\d]/gm, '');
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
