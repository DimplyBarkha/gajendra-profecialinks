/**
 * @format
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const transform = (data) => {
	const clean = (text) =>
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
			if (row.specifications) {
				let text = '';
				row.specifications.forEach((item, index) => {
					if (index % 2 === 0) {
						text += item.text.trim() + ' : ';
					} else {
						text += item.text.trim() + ' || ';
					}
				});
				row.specifications = [
					{
						text: text.slice(0, -4),
					},
				];
			}
			if (row.image) {
				row.image = row.image.splice(0, 1);
			}
			// if (row.alternateImages) {
			//   row.alternateImages = row.alternateImages.splice(1);
			// }
			if (row.alternateImages && row.firstImage) {
				row.alternateImages.forEach((element, index) => {
					if (element.text == row.firstImage[0].text) {
						row.alternateImages.splice(index, index + 1);
					}
				});
			}
			if (row.category) {
				row.category = row.category.filter((item) => {
					if (!item.text.includes('HOGAR')) {
						return item;
					}
				});
			}
			if (row.nameExtended) {
				let text = '';
				row.nameExtended.forEach((item, index) => {
					text += item.text.trim() + ' ';
				});
				row.nameExtended = [
					{
						text: text.trim(),
					},
				];
			}
			if (row.price) {
				row.price.forEach((item) => {
					item.text = item.text.replace(/,/g, '').replace(/\./, ',');
				});
			}
			if (row.sku) {
				row.sku.forEach((item) => {
					item.text =
						item.text.split(':') && item.text.split(':')[1]
							? item.text.split(':')[1].trim()
							: '';
				});
			}
			if (row.packSize) {
				row.packSize.forEach((item) => {
					item.text = item.text.includes('Piezas') ? item.text : '';
				});
			}
			if (row.mpc) {
				row.mpc.forEach((item) => {
					item.text =
						item.text.split(':') && item.text.split(':')[1]
							? item.text.split(':')[1].trim()
							: '';
				});
			}
		}
	}
	data.forEach((obj) =>
		obj.group.forEach((row) =>
			Object.keys(row).forEach((header) =>
				row[header].forEach((el) => {
					el.text = clean(el.text);
				})
			)
		)
	);

	return data;
};

module.exports = { transform };
