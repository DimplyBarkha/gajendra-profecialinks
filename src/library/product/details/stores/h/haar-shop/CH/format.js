/**
 * @format
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const transform = (data) => {
	const cleanUp = (data, context) => {
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
	for (const { group } of data) {
		for (const row of group) {
			if (row.availabilityText) {
				row.availabilityText.forEach((item) => {
					item.text = 'In Stock';
				});
			}
			if (row.description) {
				var descArr = [];
				row.description.forEach((item) => {
					descArr.push(item.text);
				});
				row.description = [{ text: descArr.join(' | ') }];
			}
			if (row.brandText) {
				if (row.nameExtended) {
					row.nameExtended = [
						{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text },
					];
				}
			}
			if (row.gtin1) {
				if (!row.gtin) {
					row.gtin = [{ text: row.gtin1[0].text }];
				}
				delete row.gtin1;
			}
			if (row.descriptionBullets) {
				var bulletArr = [];
				row.descriptionBullets.forEach((item) => {
					bulletArr.push(item.text);
				});
				if (row.description) {
					row.description = [
						{ text: row.description[0].text + ' || ' + bulletArr.join(' || ') },
					];
				} else {
					row.description = [{ text: '|| ' + bulletArr.join(' || ') }];
				}
				row.descriptionBullets = [{ text: bulletArr.length }];
			}
			if (row.specifications) {
				let text = row.specifications
					.map((specification) => specification.text.trim())
					.join(' || ')
					.trim();
				row.specifications = [{ text }];
			}
		}
	}
	return cleanUp(data);
};

module.exports = { transform };
