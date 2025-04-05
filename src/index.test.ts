/// <reference types="jest" />
import { splitLao } from './index';

describe('splitLao', () => {
  it('should segment sentence 1 correctly', () => {
    const sentence = "ປະເທດລາວເປັນສິ່ງສວຍງາມ";
    const expected = ["ປະ", "ເທດ", "ລາວ", "ເປັນ", "ສິ່ງ", "ສວຍ", "ງາມ"];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should segment sentence 2 correctly', () => {
    const sentence = "ສະບາຍດີຕອນເຊົ້າ";
    const expected = ["ສະ", "ບາຍ", "ດີ", "ຕອນ", "ເຊົ້າ"];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should segment sentence 3 correctly', () => {
    const sentence = "ຂ້ອຍກິນເຂົ້າ";
    const expected = ["ຂ້ອຍ", "ກິນ", "ເຂົ້າ"];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should segment sentence 4 correctly with non-Lao chars', () => {
    const sentence = "ພາສາລາວ 101";
    const expected = ["ພາ", "ສາ", "ລາວ", "101"];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should segment sentence 5 correctly with digraphs and vowels', () => {
    const sentence = "ໂຮງຮຽນຂອງພວກເຮົາ";
    const expected = [ 'ໂຮງ', 'ຮຽນ', 'ຂອງ', 'ພວກ', 'ເຮົາ' ];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should segment sentence 6 correctly with digraphs and vowels', () => {
    const sentence = "ຫວຽດນາມ";
    const expected = ['ຫວຽດ', 'ນາມ'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should segment sentence 7 correctly (longer complex sentence)', () => {
    const sentence = "ຂ້ອຍມັກກິນເຂົ້າໜຽວໝູປີ້ງແຊບຫລາຍ";
    const expected = [ 'ຂ້ອຍ', 'ມັກ', 'ກິນ', 'ເຂົ້າ', 'ໜຽວ', 'ໝູ', 'ປີ້ງ', 'ແຊບ', 'ຫລາຍ' ];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should segment sentence 8 correctly (mixed Lao and Non-Lao)', () => {
    const sentence = "ພາສາລາວ version 1.0 ເປັນພາສາທີ່ສວຍງາມ.";
    const expected = [ 'ພາ', 'ສາ', 'ລາວ', 'version', '1.0', 'ເປັນ', 'ພາ', 'ສາ', 'ທີ່', 'ສວຍ', 'ງາມ', '.' ];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should segment sentence 9 correctly (complex with Mai Yamok)', () => {
    const sentence = "ວຽກບ້ານພາສາອັງກິດຍາກຫລາຍແທ້ໆ.";
    const expected = [ 'ວຽກ', 'ບ້ານ', 'ພາ', 'ສາ', 'ອັງ', 'ກິດ', 'ຍາກ', 'ຫລາຍ', 'ແທ້', 'ໆ', '.' ];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should segment sentence 10 correctly (very long mixed sentence)', () => {
    const sentence = "ນັບຕັ້ງແຕ່ ວິທຍຸເອເຊັຽເສຣີ ອອກອາກາດມາເຖິງມື້ນີ້ ກໍ່ເປັນເວລາ 30 ປີແລ້ວ ທີ່ RFA ໄດ້ເຮັດໜ້າທີ່ໃນຖານະສື່ສານມວນຊົນ ເພື່ອລາຍງານຂ່າວ ຢ່າງກົງໄປກົງມາ ແຕ່ມາຮອດມື້ນີ້ ພວກເຮົາໃນນາມນັກຂ່າວ ວິທຍຸເອເຊັຽເສຣີ ຂໍແຈ້ງມາຍັງບັນທ່ານຜູ້ຕິດຕາມລາຍການ ຂອງພວກເຮົາວ່າ ພວກເຮົາຈະຍຸຕິການອັບເດດຂ່າວ ໃນເວບໄຊ ຊົ່ວຄາວ ຈົນກວ່າ ຈະມີການປ່ຽນ ໃນອະນາຄົດ.";
    const expected = ['ນັບ', 'ຕັ້ງ', 'ແຕ່', 'ວິທ', 'ຍຸ', 'ເອ', 'ເຊັຽ', 'ເສ', 'ຣີ', 'ອອກ', 'ອາ', 'ກາດ', 'ມາ', 'ເຖິງ', 'ມື້', 'ນີ້', 'ກໍ່', 'ເປັນ', 'ເວ', 'ລາ', '30', 'ປີ', 'ແລ້ວ', 'ທີ່', 'RFA', 'ໄດ້', 'ເຮັດ', 'ໜ້າ', 'ທີ່', 'ໃນ', 'ຖາ', 'ນະ', 'ສື່', 'ສານ', 'ມວນ', 'ຊົນ', 'ເພື່ອ', 'ລາຍ', 'ງານ', 'ຂ່າວ', 'ຢ່າງ', 'ກົງ', 'ໄປ', 'ກົງ', 'ມາ', 'ແຕ່', 'ມາ', 'ຮອດ', 'ມື້', 'ນີ້', 'ພວກ', 'ເຮົາ', 'ໃນ', 'ນາມ', 'ນັກ', 'ຂ່າວ', 'ວິທ', 'ຍຸ', 'ເອ', 'ເຊັຽ', 'ເສ', 'ຣີ', 'ຂໍ', 'ແຈ້ງ', 'ມາ', 'ຍັງ', 'ບັນ', 'ທ່ານ', 'ຜູ້', 'ຕິດ', 'ຕາມ', 'ລາຍ', 'ການ', 'ຂອງ', 'ພວກ', 'ເຮົາ', 'ວ່າ', 'ພວກ', 'ເຮົາ', 'ຈະ', 'ຍຸ', 'ຕິ', 'ການ', 'ອັບ', 'ເດດ', 'ຂ່າວ', 'ໃນ', 'ເວບ', 'ໄຊ', 'ຊົ່ວ', 'ຄາວ', 'ຈົນ', 'ກວ່າ', 'ຈະ', 'ມີ', 'ການ', 'ປ່ຽນ', 'ໃນ', 'ອະ', 'ນາ', 'ຄົດ', '.'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should return empty array for empty string', () => {
    expect(splitLao('')).toEqual([]);
  });

  it('should return empty array for string with only spaces', () => {
    expect(splitLao('   ')).toEqual([]);
  });

  it('should segment sentence with "ກວ" cluster correctly', () => {
    const sentence = "ຈົນກວ່າຈະ";
    const expected = ['ຈົນ', 'ກວ່າ', 'ຈະ'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should segment sentence 11 correctly (long RFA news sentence)', () => {
    const sentence = "ຄຳສັ່ງ ຝ່າຍບໍລິຫານ ທີ່ອອກໂດຍ ປະທານາທິບໍດີ ໂດນັລ ທຣັມ ຂອງສະຫະລັດ ໃນແລງວັນສຸກ ຮຽກຮ້ອງໃຫ້ຫລຸດ ອົງກອນ ທີ່ບໍ່ຈຳເປັນຕາມ​ກົດ​ໝາຍ ຂອງອົງການສື່ມວນຊົນທົ່ວໂລກ ຂອງສະຫະລັດ (United State Agency for Global Media) ຫລື (USAGM), ເຊິ່ງເປັນອົງການ ຂອງລັດຖະບານກາງ ທີ່ໃຫ້ທຶນແກ່ ວິ​ທ​ຍຸ ​ເອ​ເຊັຽ ​ເສ​ຣີ (RFA) ແລະ ອົງການຂ່າວ ອິດສະຫຼະ ທົ່ວໂລກອື່ນໆ.";
    const expected = [
      'ຄຳ', 'ສັ່ງ', 'ຝ່າຍ', 'ບໍ', 'ລິ', 'ຫານ', 'ທີ່', 'ອອກ', 'ໂດຍ', 'ປະ', 'ທາ', 'ນາ', 'ທິ', 'ບໍ', 'ດີ', 'ໂດ', 'ນັລ', 'ທ', 'ຣັມ', 'ຂອງ', 'ສະ', 'ຫະ', 'ລັດ',
      'ໃນ', 'ແລງ', 'ວັນ', 'ສຸກ', 'ຮຽກ', 'ຮ້ອງ', 'ໃຫ້', 'ຫລຸດ', 'ອົງ', 'ກອນ', 'ທີ່', 'ບໍ່', 'ຈຳ', 'ເປັນ', 'ຕາມ', 'ກົດ', 'ໝາຍ',
      'ຂອງ', 'ອົງ', 'ການ', 'ສື່', 'ມວນ', 'ຊົນ', 'ທົ່ວ', 'ໂລກ', 'ຂອງ', 'ສະ', 'ຫະ', 'ລັດ', '(United', 'State', 'Agency', 'for', 'Global', 'Media)',
      'ຫລື', '(USAGM),', 'ເຊິ່ງ', 'ເປັນ', 'ອົງ', 'ການ', 'ຂອງ', 'ລັດ', 'ຖະ', 'ບານ', 'ກາງ', 'ທີ່', 'ໃຫ້', 'ທຶນ', 'ແກ່', 'ວິທ', 'ຍຸ', 'ເອ', 'ເຊັຽ',
      'ເສ', 'ຣີ', '(RFA)', 'ແລະ', 'ອົງ', 'ການ', 'ຂ່າວ', 'ອິດ', 'ສະ', 'ຫຼະ', 'ທົ່ວ', 'ໂລກ', 'ອື່ນ', 'ໆ', '.'
    ];
    expect(splitLao(sentence)).toEqual(expected);
  });
}); 