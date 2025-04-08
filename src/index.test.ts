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
      'ຄຳ', 'ສັ່ງ', 'ຝ່າຍ', 'ບໍ', 'ລິ', 'ຫານ', 'ທີ່', 'ອອກ', 'ໂດຍ', 'ປະ', 'ທາ', 'ນາ', 'ທິ', 'ບໍ', 'ດີ', 'ໂດ', 'ນັລ', 'ທຣັມ', 'ຂອງ', 'ສະ', 'ຫະ', 'ລັດ',
      'ໃນ', 'ແລງ', 'ວັນ', 'ສຸກ', 'ຮຽກ', 'ຮ້ອງ', 'ໃຫ້', 'ຫລຸດ', 'ອົງ', 'ກອນ', 'ທີ່', 'ບໍ່', 'ຈຳ', 'ເປັນ', 'ຕາມ', 'ກົດ', 'ໝາຍ',
      'ຂອງ', 'ອົງ', 'ການ', 'ສື່', 'ມວນ', 'ຊົນ', 'ທົ່ວ', 'ໂລກ', 'ຂອງ', 'ສະ', 'ຫະ', 'ລັດ', '(United', 'State', 'Agency', 'for', 'Global', 'Media)',
      'ຫລື', '(USAGM),', 'ເຊິ່ງ', 'ເປັນ', 'ອົງ', 'ການ', 'ຂອງ', 'ລັດ', 'ຖະ', 'ບານ', 'ກາງ', 'ທີ່', 'ໃຫ້', 'ທຶນ', 'ແກ່', 'ວິທ', 'ຍຸ', 'ເອ', 'ເຊັຽ',
      'ເສ', 'ຣີ', '(RFA)', 'ແລະ', 'ອົງ', 'ການ', 'ຂ່າວ', 'ອິດ', 'ສະ', 'ຫຼະ', 'ທົ່ວ', 'ໂລກ', 'ອື່ນ', 'ໆ', '.'
    ];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should segment sentence 12 correctly (very long complex sentence with mixed cases)', () => {
    const sentence = "ຄວາມເເຕກຕ່າງລະຫວ່າງຕອນຮຽນກັບຕອນເຮັດວຽກກັບຕອນເຮັດວຽກເເລະຮຽນນຳຮູ້ສຶກເເນວໃດຈາກຄວາມຮູ້ສຶກຂອງເເຕ່ລະຄົນ.ຕອນຮຽນກັບເຮັດວຽກ.";
    const expected = [
      'ຄວາມ', 'ເເຕກ', 'ຕ່າງ', 'ລະ', 'ຫວ່າງ', 'ຕອນ', 'ຮຽນ', 'ກັບ', 'ຕອນ', 'ເຮັດ', 'ວຽກ', 'ກັບ',
      'ຕອນ', 'ເຮັດ', 'ວຽກ', 'ເເລະ', 'ຮຽນ', 'ນຳ', 'ຮູ້', 'ສຶກ', 'ເເນວ', 'ໃດ', 'ຈາກ', 'ຄວາມ',
      'ຮູ້', 'ສຶກ', 'ຂອງ', 'ເເຕ່', 'ລະ', 'ຄົນ', '.', 'ຕອນ', 'ຮຽນ', 'ກັບ', 'ເຮັດ', 'ວຽກ', '.'
    ];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle mixed languages correctly', () => {
    const sentence = "ສະບາຍດີ Hello World ຄວາມຮັກ Love ຄວາມສຸກ Happy 你好 ສະບາຍດີ";
    const expected = [
      'ສະ', 'ບາຍ', 'ດີ', 'Hello', 'World', 'ຄວາມ', 'ຮັກ', 'Love',
      'ຄວາມ', 'ສຸກ', 'Happy', '你好', 'ສະ', 'ບາຍ', 'ດີ'
    ];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle special characters and symbols correctly', () => {
    const sentence = "ຂໍ້ຄວາມ@!@$#$%&*()ພິເສດ!!!???***";
    const expected = ['ຂໍ້', 'ຄວາມ', '@!@$#$%&*()', 'ພິ', 'ເສດ', '!!!???***'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle mixed languages with emojis and URLs', () => {
    const sentence = "ເວັບໄຊ https://www.example.com 😊 ພາສາລາວ-English-中文 👍 @username #hashtag";
    const expected = [
      'ເວັບ', 'ໄຊ', 'https://www.example.com', '😊', 'ພາ', 'ສາ', 'ລາວ',
      '-English-中文', '👍', '@username', '#hashtag'
    ];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle mathematical expressions and special characters', () => {
    const sentence = "ຄະນິດສາດ 1+1=2 ແລະ x²+y²=z² ຫຼື f(x)=∑(n=1)";
    const expected = [
      'ຄະ', 'ນິດ', 'ສາດ', '1+1=2', 'ແລະ', 'x²+y²=z²', 'ຫຼື', 'f(x)=∑(n=1)'
    ];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle code snippets and technical content', () => {
    const sentence = "ຕົວແປ variable_name = 'ຄ່າ' && code.split('').join();";
    const expected = [
      'ຕົວ', 'ແປ', "variable_name", "=", "'", "ຄ່າ", "'", "&&", "code.split('').join();"
    ];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle pure English text correctly', () => {
    const sentence = "Hello World! This is a test sentence with some punctuation.";
    const expected = ['Hello', 'World!', 'This', 'is', 'a', 'test', 'sentence', 'with', 'some', 'punctuation.'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle pure Thai text correctly', () => {
    const sentence = "สวัสดีชาวโลก นี่คือการทดสอบการแยกคำ";
    const expected = ['สวัสดีชาวโลก', 'นี่คือการทดสอบการแยกคำ'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle pure Chinese text correctly', () => {
    const sentence = "你好世界！这是一个测试句子。";
    const expected = ['你好世界！这是一个测试句子。'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle pure Japanese text correctly', () => {
    const sentence = "こんにちは世界！これはテスト文です。";
    const expected = ['こんにちは世界！これはテスト文です。'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle pure Korean text correctly', () => {
    const sentence = "안녕하세요 세계! 이것은 테스트 문장입니다.";
    const expected = ['안녕하세요', '세계!', '이것은', '테스트', '문장입니다.'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle mixed non-Lao languages correctly', () => {
    const sentence = "Hello สวัสดี 你好 こんにちは 안녕하세요";
    const expected = ['Hello', 'สวัสดี', '你好', 'こんにちは', '안녕하세요'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle mixed non-Lao languages with punctuation', () => {
    const sentence = "Hello! สวัสดีครับ 你好！ こんにちは！ 안녕하세요!";
    const expected = ['Hello!', 'สวัสดีครับ', '你好！', 'こんにちは！', '안녕하세요!'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle mixed non-Lao languages with numbers and symbols', () => {
    const sentence = "Hello 123 สวัสดี 456 你好 789 こんにちは 101 안녕하세요 @#$%";
    const expected = ['Hello', '123', 'สวัสดี', '456', '你好', '789', 'こんにちは', '101', '안녕하세요', '@#$%'];
    expect(splitLao(sentence)).toEqual(expected);
  });

  it('should handle complex Lao language edge cases', () => {
    const sentence = "ຄວາມຮູ້ສຶກຂອງຄົນທີ່ມີຄວາມຮັກຕອງກັນຢ່າງເລິກເຊິ່ງແລະມີຄວາມເຂົ້າໃຈກັນຢ່າງສົມບູນທີ່ສຸດທີ່ສາມາດເຮັດໃຫ້ຄວາມສຳພັນຂອງພວກເຂົາເຈົ້າມີຄວາມໝັ້ນຄົງແລະຍືນຍົງຕະຫຼອດໄປ";
    const expected = [
      'ຄວາມ', 'ຮູ້', 'ສຶກ', 'ຂອງ', 'ຄົນ', 'ທີ່', 'ມີ', 'ຄວາມ', 'ຮັກ', 'ຕອງ', 'ກັນ', 'ຢ່າງ', 'ເລິກ', 'ເຊິ່ງ',
      'ແລະ', 'ມີ', 'ຄວາມ', 'ເຂົ້າ', 'ໃຈ', 'ກັນ', 'ຢ່າງ', 'ສົມ', 'ບູນ', 'ທີ່', 'ສຸດ', 'ທີ່', 'ສາ', 'ມາດ',
      'ເຮັດ', 'ໃຫ້', 'ຄວາມ', 'ສຳ', 'ພັນ', 'ຂອງ', 'ພວກ', 'ເຂົາ', 'ເຈົ້າ', 'ມີ', 'ຄວາມ', 'ໝັ້ນ', 'ຄົງ',
      'ແລະ', 'ຍືນ', 'ຍົງ', 'ຕະ', 'ຫຼອດ', 'ໄປ'
    ];
    expect(splitLao(sentence)).toEqual(expected);
  });
}); 