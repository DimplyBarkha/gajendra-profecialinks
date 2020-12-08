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
      if (row.availabilityText) {
        row.availabilityText.forEach(availabilityTextItem => {
          if (availabilityTextItem.text.toLowerCase().includes('instock') || availabilityTextItem.text.toLowerCase().includes('instore')) {
            availabilityTextItem.text = 'In Stock';
          } else {
            availabilityTextItem.text = 'Out Of Stock';
          }
        });
      }
      if (row.image) {
        row.image.forEach(itemText => {
          itemText.text = itemText.text.includes('http') ? itemText.text : 'https:' + itemText.text;
        });
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(manufacturerImagesText => {
          manufacturerImagesText.text = manufacturerImagesText.text.includes('http') ? manufacturerImagesText.text : 'https:' + manufacturerImagesText.text;
        });
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(manufacturerDescriptionItem => {
          manufacturerDescriptionItem.text = cleanUp(manufacturerDescriptionItem.text);
        });
      }
      if (row.specifications) {
        row.specifications.forEach(specificationsItem => {
          specificationsItem.text = cleanUp(specificationsItem.text.replace(/(\n\s*){3,}/g, ' ').replace(/ ?:(\n\s*){2,}/g, ' : ').replace(/(\n\s*){2,}/g, ' || '));
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.includes('http') ? item.text : 'https:' + item.text;
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach((aggregateRatingItem) => {
          aggregateRatingItem.text = aggregateRatingItem.text.replace('.', ',');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach((listPriceItem) => {
          listPriceItem.text = listPriceItem.text.replace(/,-/g, '');
        });
      }
      if (row.price) {
        row.price.forEach((priceItem) => {
          priceItem.text = priceItem.text.replace('.', ',');
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach((ratingCountItem) => {
          ratingCountItem.text = ratingCountItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.inTheBoxUrl) {
        if ((row.inTheBoxUrl[0].text.includes('media.flixcar.com') || row.inTheBoxUrl[0].text.includes('syndication.flix360.com')) && row.inTheBoxUrl[0].text.includes('1000w')) {
          row.inTheBoxUrl.forEach(item => {
            const img = 'https:' + item.text.split(' ')[0];
            const imgText = img;
            item.text = imgText;
          });
        }
      }
    }
  }
  return data;
};
module.exports = { transform };
