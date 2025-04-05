# Lao Word Splitter

ເຄື່ອງມືສຳລັບແຍກປະໂຫຍກພາສາລາວ ອອກເປັນແຕ່ລະຄຳອີງຕາມໂຄງສ້າງພະຍາງ້ຳ.

A utility to split Lao language sentences into individual words based on syllable structure rules.

## ການຕິດຕັ້ງ / Installation

```bash
npm install lao-word-splitter
```

## ການໃຊ້ງານ / Usage

```typescript
import { splitLao } from 'lao-word-splitter';

// Example 1: Basic usage
const sentence = "ສະບາຍດີຕອນເຊົ້າ";
const words = splitLao(sentence);
console.log(words); // ["ສະ", "ບາຍ", "ດີ", "ຕອນ", "ເຊົ້າ"]

// Example 2: Mixed Lao and non-Lao text
const mixedText = "ພາສາລາວ Lao language 101";
const mixedWords = splitLao(mixedText);
console.log(mixedWords); // ["ພາ", "ສາ", "ລາວ", "Lao", "language", "101"]
```

## ຄຸນສົມບັດ / Features

- ແຍກປະໂຫຍກພາສາລາວ ອອກເປັນແຕ່ລະຄຳ
- ຮອງຮັບເນື້ອຫາທີ່ເປັນພາສາລາວປົນກັບອັກສອນອື່ນໆ
- ບັນຈຸກົດເກນທາງດ້ານພາສາສາດ ເພື່ອແຍກຄຳພາສາລາວທີ່ຖືກຕ້ອງ

- Splits Lao sentences into individual words
- Supports mixed Lao and non-Lao text
- Implements linguistic rules for correct Lao word segmentation

## ວິທີການທຳງານ / How It Works

ຟັງຊັນນີ້ໃຊ້ກົດເກນທາງດ້ານໂຄງສ້າງພະຍາງຄຳພາສາລາວເພື່ອກຳນົດຂອບເຂດຂອງຄຳ, ໂດຍອີງໃສ່:

- ຕົວອັກສອນທີ່ບົ່ງບອກການເລີ່ມຕົ້ນຄຳໃໝ່ (ເຊັ່ນ: ເ, ແ, ໂ, ໄ, ໃ)
- ຕົວອັກສອນກາງຄຳ (ສະຫຼະ, ວັນນະຍຸດ)
- ໂຄງສ້າງພິເສດ (ເຊັ່ນ: ກວ, ຫວ)
- ການຕັດແບ່ງເມື່ອມີການປ່ຽນແປງລະຫວ່າງພາສາລາວ ແລະ ພາສາອື່ນ

This function uses Lao syllable structure rules to determine word boundaries, based on:

- Characters indicating the start of new words (e.g., ເ, ແ, ໂ, ໄ, ໃ)
- Mid-word characters (vowels, tone marks)
- Special structures (like digraphs: ກວ, ຫວ)
- Segmentation at transitions between Lao and non-Lao text

## ລິຂະສິດ / License

MIT 