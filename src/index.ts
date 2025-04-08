// ຕົວອັກສອນພື້ນຖານ (Consonants)
const LAO_CONSONANTS = new Set([
  'ກ', 'ຂ', 'ຄ', 'ງ', 'ຈ', 'ສ', 'ຊ', 'ຍ', 'ດ', 'ຕ', 'ຖ', 'ທ', 'ນ',
  'ບ', 'ປ', 'ຜ', 'ຝ', 'ພ', 'ຟ', 'ມ', 'ຢ', 'ຣ', 'ລ', 'ວ', 'ຫ', 'ອ', 'ຮ',
  'ໜ', 'ໝ' // Considered distinct consonants
]);

// ຕົວອັກສອນທີ່ບົ່ງບອກວ່າອາດຈະເລີ່ມຕົ້ນຄຳໃໝ່ (Characters indicating a potential new word start)
// ຕົວຢ່າງ: ເກມ, ແປ, ໂຕ, ໄປ, ໃນ - ເຫລົ່ານີ້ ມັກຈະເປັນຈຸດເລີ່ມຕົ້ນຂອງຄຳໃໝ່
const LEADING_VOWELS = new Set(['ເ', 'ແ', 'ໂ', 'ໄ', 'ໃ']);

// ຕົວອັກສອນກາງຄຳ/ສະຫຼະ/ວັນນະຍຸດ (Mid-word characters: vowels, tones, etc.)
// ຕົວຢ່າງ: ກະ, ນາ, ດິນ, ຊີມ, ກຶກ, ປື, ຮຸກ, ງູ ແລະ ອື່ນໆ
const MIDDLE_CHARS = new Set([
  'ະ', 'າ', 'ິ', 'ີ', 'ຶ', 'ື', 'ຸ', 'ູ', // Base vowels
  'ໍ', // Vowel O / AM
  'ຳ', // Vowel AM (also often acts as middle)
  '່', '້', '໊', '໋', // Tones
  'ຼ', // Ligation mark (LO)
  '໌', // Cancellation mark (KAN)
  'ຽ', // Vowel IA
  'ັ', // Vowel sign MAI KANG
  'ົ'  // Vowel sign MAI KON
]);

// Consonants that can follow 'ຫ' to form a digraph
// ຕົວຢ່າງ: ຫງາຍ, ຫຍ້າ, ຫຼາຍ, ຫວ້າ, ຫຣິດ
const DIGRAPH_FOLLOWERS = new Set(['ງ', 'ຍ', 'ລ', 'ວ', 'ຣ']);

// Special character that always forms its own word
// ຕົວຢ່າງ: ແດງໆ - 'ໆ' ຈະຖືກແຍກເປັນຄຳຂອງຕົວເອງສະເໝີ
const MAI_YAMOK = 'ໆ';

/**
 * ກວດກາວ່າຕົວອັກສອນແມ່ນພາສາລາວຫຼືບໍ່
 * Checks if a character is part of Lao script
 * 
 * ຕົວຢ່າງ:
 * isLaoCharacter('ກ') => true
 * isLaoCharacter('a') => false
 * isLaoCharacter('1') => false
 */
function isLaoCharacter(char: string): boolean {
  if (!char) return false;
  const charCode = char.charCodeAt(0);
  // Lao Unicode block: U+0E80 to U+0EFF
  return charCode >= 0x0E80 && charCode <= 0x0EFF;
}

/**
 * ຟັງຊັນຊ່ວຍເຫຼືອສຳລັບການເພີ່ມຄຳໃໝ່ແລະເລີ່ມຕົ້ນຄຳໃໝ່
 * Helper function to add a word to the result array and start a new word
 * 
 * ຕົວຢ່າງ:
 * addWordToResult('ປະ', words, 'ເ') => 'ເ' ແລະ words = ['ປະ']
 * addWordToResult('ລາວ', words, 'ເ') => 'ເ' ແລະ words = ['ປະ', 'ລາວ']
 */
function addWordToResult(currentWord: string, resultArray: string[], newWord: string = ''): string {
  if (currentWord.length > 0) {
    resultArray.push(currentWord);
  }
  return newWord;
}

/**
 * ຟັງຊັນຊ່ວຍເຫຼືອສຳລັບຈັດການກັບຕົວອັກສອນປະສົມກັບ "ວ" (ກວ, ຂວ, ຄວ)
 * Helper function to handle consonant + 'ວ' sequences
 * 
 * ຕົວຢ່າງ:
 * "ຈົນກວ່າຈະ" ເມື່ອພົບ '່' ຫຼັງ 'ກວ':
 * handleConsonantVSequence('ຈົນກວ', '່', words) => 'ກວ່' ແລະ words = ['ຈົນ']
 * 
 * "ຄວາມຮັກ" ເມື່ອພົບ 'າ' ຫຼັງ 'ຄວ':
 * handleConsonantVSequence('ຄວ', 'າ', words) => 'ຄວາ' ແລະ words = []
 * 
 * "ຂວາງາມ" ເມື່ອພົບ 'າ' ຫຼັງ 'ຂວ':
 * handleConsonantVSequence('ຂວ', 'າ', words) => 'ຂວາ' ແລະ words = []
 */
function handleConsonantVSequence(currentWord: string, char: string, resultArray: string[]): string {
  const secondLastChar = currentWord[currentWord.length - 2];
  const lastChar = currentWord[currentWord.length - 1];
  const consonantVSequence = secondLastChar + lastChar; // e.g., 'ກວ', 'ຂວ', 'ຄວ'
  const wordBeforeSequence = currentWord.slice(0, -2);
  
  if (wordBeforeSequence.length > 0) {
    resultArray.push(wordBeforeSequence);
  }
  return consonantVSequence + char;
}

/**
 * ຟັງຊັນຊ່ວຍເຫຼືອສຳລັບຈັດການກັບຕົວອັກສອນນຳໜ້າ "ຫ" (ຫງ, ຫຍ, ຫຼ, ຫວ, ຫຣ)
 * Helper function to handle digraphs with 'ຫ'
 * 
 * ຕົວຢ່າງ:
 * "ຫວານຫລາຍ" ເມື່ອພົບ 'າ' ຫຼັງ 'ຫວ':
 * handleDigraphSequence('ຫວ', 'າ', words) => 'ຫວາ' ແລະ words = []
 */
function handleDigraphSequence(currentWord: string, char: string, resultArray: string[]): string {
  const secondLastChar = currentWord[currentWord.length - 2];
  const lastChar = currentWord[currentWord.length - 1];
  const digraph = secondLastChar + lastChar; // e.g., 'ຫວ'
  const wordBeforeDigraph = currentWord.slice(0, -2);
  
  if (wordBeforeDigraph.length > 0) {
    resultArray.push(wordBeforeDigraph);
  }
  return digraph + char;
}

/**
 * ຟັງຊັນຊ່ວຍເຫຼືອສຳລັບຈັດການກັບຕົວອັກສອນກາງຄຳທົ່ວໄປ
 * Helper function to handle regular middle character processing
 * 
 * ຕົວຢ່າງ:
 * "ເທດລາວ" ເມື່ອພົບ 'າ' ຫຼັງ 'ລ':
 * handleRegularMiddleChar('ເທດລ', 'າ', words) => 'ລາ' ແລະ words = ['ເທດ']
 */
function handleRegularMiddleChar(currentWord: string, char: string, resultArray: string[]): string {
  const lastChar = currentWord[currentWord.length - 1];
  const wordWithoutLast = currentWord.slice(0, -1);
  
  if (wordWithoutLast.length > 0) {
    resultArray.push(wordWithoutLast);
  }
  return lastChar + char;
}

/**
 * ຟັງຊັນຊ່ວຍເຫຼືອສຳລັບຈັດການກັບຕົວອັກສອນ 'ວ' ຫຼື 'ອ' ລະຫວ່າງພະຍັນຊະນະ
 * Helper function to handle 'ວ' or 'ອ' between consonants
 * 
 * ຕົວຢ່າງ:
 * "ສຶ່ງສວຍງາມ" ເມື່ອພົບ "ວ" ຫຼັງ "ສ" ແລະ ຕາມດ້ວຍ "ຍ":
 * handleVaOrOSequence('ສຶ່ງສ', 'ວ', words) => 'ສວ' ແລະ words = ['ສຶ່ງ']
 */
function handleVaOrOSequence(currentWord: string, char: string, resultArray: string[]): string {
  const lastConsonant = currentWord.slice(-1);
  const wordWithoutLast = currentWord.slice(0, -1);
  
  if (wordWithoutLast.length > 0) {
    resultArray.push(wordWithoutLast);
  }
  return lastConsonant + char;
}

/**
 * ຟັງຊັນຊ່ວຍເຫຼືອສຳລັບຈັດການກັບຕົວອັກສອນປະສົມກັບ "ຣ" (ທຣ, ປຣ, ກຣ, ບຣ, ຟຣ)
 * Helper function to handle consonant + 'ຣ' sequences
 * 
 * ຕົວຢ່າງ:
 * "ທຣັມ" ເມື່ອພົບ 'ັ' ຫຼັງ 'ຣ':
 * handleConsonantRSequence('ທຣ', 'ັ', words) => 'ທຣັ' ແລະ words = []
 * 
 * "ປຣິນເຕີ" ເມື່ອພົບ 'ິ' ຫຼັງ 'ຣ':
 * handleConsonantRSequence('ປຣ', 'ິ', words) => 'ປຣິ' ແລະ words = []
 * 
 * "ກຣາມ" ເມື່ອພົບ 'າ' ຫຼັງ 'ຣ':
 * handleConsonantRSequence('ກຣ', 'າ', words) => 'ກຣາ' ແລະ words = []
 */
function handleConsonantRSequence(currentWord: string, char: string, resultArray: string[]): string {
  const secondLastChar = currentWord[currentWord.length - 2];
  const lastChar = currentWord[currentWord.length - 1];
  const consonantRSequence = secondLastChar + lastChar; // e.g., 'ທຣ', 'ປຣ', 'ກຣ', 'ບຣ', 'ຟຣ'
  const wordBeforeSequence = currentWord.slice(0, -2);
  
  if (wordBeforeSequence.length > 0) {
    resultArray.push(wordBeforeSequence);
  }
  return consonantRSequence + char;
}

/**
 * ກຳຈັດຊ່ອງຫວ່າງ zero width space ທີ່ສາມາດລົບກວນການແຍກຄຳ
 * Remove Zero Width Spaces
 * 
 * ຕົວຢ່າງ:
 * removeZeroWidthSpaces("ສະ​ບາຍ​ດີ") => "ສະບາຍດີ"
 */
function removeZeroWidthSpaces(text: string): string {
  return text.replace(/\u200B/g, '');
}

/**
 * ແຍກປະໂຫຍກພາສາລາວອອກເປັນແຕ່ລະຄຳ
 * Splits a Lao language sentence into individual words based on syllable structure rules.
 *
 * @param sentence ປະໂຫຍກພາສາລາວທີ່ຕ້ອງການແຍກ / The Lao sentence to be segmented.
 * @returns Array ຂອງຄຳສັບທີ່ແຍກອອກມາ / An array of segmented words.
 * 
 * ຕົວຢ່າງ:
 * splitLao("ປະເທດລາວເປັນສິ່ງສວຍງາມ") => ["ປະ", "ເທດ", "ລາວ", "ເປັນ", "ສິ່ງ", "ສວຍ", "ງາມ"]
 * splitLao("ຈົນກວ່າຈະ") => ["ຈົນ", "ກວ່າ", "ຈະ"]
 * splitLao("ຫວຽດນາມ") => ["ຫວຽດ", "ນາມ"]
 * splitLao("ພາສາລາວ 101") => ["ພາ", "ສາ", "ລາວ", "101"]
 */
export function splitLao(sentence: string): string[] {
  // Handle empty input
  if (!sentence || sentence.trim().length === 0) {
    return [];
  }
  
  // Preprocessing: remove zero width spaces
  // ຕົວຢ່າງ: "ສະ​ບາຍ​ດີ" => "ສະບາຍດີ"
  sentence = removeZeroWidthSpaces(sentence);
  
  const words: string[] = [];
  let currentWord = '';
  
  for (let i = 0; i < sentence.length; i++) {
    const char = sentence[i];
    
    // Get context for current character
    // ຕົວຢ່າງ 1: ປະໂຫຍກ "ປະເທດລາວ" ໃນ index 3 (ຕົວ 'ທ'):
    // - char = 'ທ'
    // - currentCharIsLao = true (ທ ແມ່ນຕົວອັກສອນລາວ)
    // - lastCharOfCurrentWord = 'ເ' (ຕົວສຸດທ້າຍຂອງ currentWord "ເ")
    // - lastCharWasLao = true (ເ ແມ່ນຕົວອັກສອນລາວ)
    // - secondLastChar = '' (ບໍ່ມີຕົວທີສອງ ເພາະ currentWord = "ເ" ມີແຕ່ຕົວດຽວ)
    // - nextChar = 'ດ' (ຕົວຖັດໄປແມ່ນ 'ດ')
    const currentCharIsLao = isLaoCharacter(char);
    const lastCharOfCurrentWord = currentWord.length > 0 ? currentWord[currentWord.length - 1] : '';
    const lastCharWasLao = isLaoCharacter(lastCharOfCurrentWord);
    const secondLastChar = currentWord.length > 1 ? currentWord[currentWord.length - 2] : '';
    const nextChar = i + 1 < sentence.length ? sentence[i + 1] : null;

    // --------- GUARD CONDITIONS ---------

    // GUARD: Space character - add current word and reset
    // ຕົວຢ່າງ: "ພາສາລາວ 101" ເມື່ອພົບຊ່ອງຫວ່າງຫຼັງ "ລາວ"
    // currentWord = "ລາວ" => words = ["ພາ", "ສາ", "ລາວ"], currentWord = ""
    if (char === ' ') {
      currentWord = addWordToResult(currentWord, words);
      continue;
    }

    // GUARD: Non-Lao character processing
    if (!currentCharIsLao) {
      // Transition from Lao to non-Lao
      // ຕົວຢ່າງ: "ພາສາລາວ 101" ເມື່ອພົບ "1" ຫຼັງ ຊ່ອງຫວ່າງ
      // currentWord = "" => words = ["ພາ", "ສາ", "ລາວ"], currentWord = "1"
      if (lastCharWasLao) {
        currentWord = addWordToResult(currentWord, words, char);
        continue;
      }
      
      // If both current and last char are non-Lao, just append
      // ຕົວຢ່າງ: "ພາສາລາວ 101" ເມື່ອພົບ "0" ຫຼັງ "1"
      // currentWord = "1" => currentWord = "10"
      currentWord += char;
      continue;
    }

    // --- Lao character processing ---
    
    // GUARD: Mai Yamok ('ໆ') - Always treat as separate word
    // ຕົວຢ່າງ: "ແດງໆ" ເມື່ອພົບ "ໆ" ຫຼັງ "ງ"
    // currentWord = "ແດງ" => words = ["ແດງ"], currentWord = "ໆ"
    if (char === MAI_YAMOK) {
      currentWord = addWordToResult(currentWord, words, MAI_YAMOK);
      continue;
    }
    
    // GUARD: Leading vowels start a new word
    // ຕົວຢ່າງ: "ປະເທດລາວ" ເມື່ອພົບ "ເ" ຫຼັງ "ະ"
    // currentWord = "ປະ" => words = ["ປະ"], currentWord = "ເ"
    if (LEADING_VOWELS.has(char)) {
      // Special case: Don't split on second 'ເ' if previous char was also 'ເ'
      // ຕົວຢ່າງ: "ເເຕກຕ່າງ" ເມື່ອພົບ "ເ" ທີສອງ ຫຼັງຈາກ "ເ" ທຳອິດ
      // currentWord = "ເ" => currentWord = "ເເ"
      if (char === 'ເ' && lastCharOfCurrentWord === 'ເ') {
        currentWord += char;
        continue;
      }
      
      currentWord = addWordToResult(currentWord, words, char);
      continue;
    }
    
    // GUARD: Transition from non-Lao to Lao
    // ຕົວຢ່າງ: "RFA ລາວ" ເມື່ອພົບ "ລ" ຫຼັງ ຊ່ອງຫວ່າງ
    // currentWord = "" => words = ["RFA"], currentWord = "ລ"
    if (!lastCharWasLao && currentWord.length > 0) {
      currentWord = addWordToResult(currentWord, words, char);
      continue;
    }
    
    // GUARD: Handle middle characters (vowels, tones, etc.)
    if (MIDDLE_CHARS.has(char)) {
      // If current word is empty, start a new word with this middle char
      // ຕົວຢ່າງ: "າ" ເມື່ອເລີ່ມຕົ້ນດ້ວຍສະຫຼະ (ບໍ່ປົກກະຕິ)
      // currentWord = "" => currentWord = "າ"
      if (currentWord.length === 0) {
        currentWord = char;
        continue;
      }
      
      // Check if we should simply append the middle character
      // 1. ກໍລະນີ ຕົວກາງຕໍ່ຕົວກາງ: "ສຶ່" ເມື່ອພົບ "່" ຫຼັງ "ຶ" => "ສຶ່"
      // 2. ກໍລະນີ ມີສະຫຼະນຳໜ້າ: "ເປ" ເມື່ອພົບ "ັ" ຫຼັງ "ປ" ທີ່ມີ "ເ" ນຳໜ້າ => "ເປັ"
      const shouldAppendMiddleChar = 
        MIDDLE_CHARS.has(lastCharOfCurrentWord) || 
        (char === 'ັ' && currentWord.length >= 2 && LEADING_VOWELS.has(secondLastChar));
          
      if (shouldAppendMiddleChar) {
        currentWord += char;
        continue;
      }
      
      // GUARD: Special case for consonant + 'ວ' sequences (ກວ, ຂວ, ຄວ)
      // ຕົວຢ່າງ: 
      // - "ຈົນກວ່າຈະ" ເມື່ອພົບ "່" ຫຼັງ "ວ" ທີ່ນຳໜ້າດ້ວຍ "ກ"
      // - "ຄວາມຮັກ" ເມື່ອພົບ "າ" ຫຼັງ "ວ" ທີ່ນຳໜ້າດ້ວຍ "ຄ"
      // - "ຂວາງາມ" ເມື່ອພົບ "າ" ຫຼັງ "ວ" ທີ່ນຳໜ້າດ້ວຍ "ຂ"
      if (currentWord.length >= 2 && lastCharOfCurrentWord === 'ວ' && 
          (secondLastChar === 'ກ' || secondLastChar === 'ຂ' || secondLastChar === 'ຄ')) {
        currentWord = handleConsonantVSequence(currentWord, char, words);
        continue;
      }
      
      // GUARD: Special case for consonant + 'ຣ' sequences (ທຣ, ປຣ, ກຣ, ບຣ, ຟຣ)
      if (currentWord.length >= 2 && lastCharOfCurrentWord === 'ຣ' && 
          (secondLastChar === 'ທ' || secondLastChar === 'ປ' || secondLastChar === 'ກ' || 
           secondLastChar === 'ບ' || secondLastChar === 'ຟ')) {
        currentWord = handleConsonantRSequence(currentWord, char, words);
        continue;
      }
      
      // GUARD: Special case for digraphs with 'ຫ'
      // ຕົວຢ່າງ: "ຫວຽດນາມ" ເມື່ອພົບ "ຽ" ຫຼັງ "ວ" ທີ່ນຳໜ້າດ້ວຍ "ຫ"
      // currentWord = "ຫວ" => words = [], currentWord = "ຫວຽ"
      if (currentWord.length >= 2 && secondLastChar === 'ຫ' && DIGRAPH_FOLLOWERS.has(lastCharOfCurrentWord)) {
        currentWord = handleDigraphSequence(currentWord, char, words);
        continue;
      }
      
      // GUARD: Regular middle char handling - check if we need to split
      // ຕົວຢ່າງ: "ເທດລາວ" ເມື່ອພົບ "າ" ຫຼັງ "ລ"
      // ກວດສອບວ່າ "ລ" ແມ່ນພະຍັນຊະນະ ແລະ "ເທດ" ບໍ່ແມ່ນສະຫຼະນຳໜ້າຕາມດ້ວຍພະຍັນຊະນະ
      // currentWord = "ເທດລ" => words = ["ເທດ"], currentWord = "ລາ"
      const isLastCharConsonant = LAO_CONSONANTS.has(lastCharOfCurrentWord);
      const isSecondLastLeadingVowel = currentWord.length >= 2 && LEADING_VOWELS.has(secondLastChar);
      
      if (isLastCharConsonant && !isSecondLastLeadingVowel) {
        currentWord = handleRegularMiddleChar(currentWord, char, words);
      } else {
        // Append in other cases
        currentWord += char;
      }
      continue;
    }
    
    // GUARD: Special check for 'ວ' or 'ອ' between consonants
    // ຕົວຢ່າງ: "ສຶ່ງສວຍງາມ" ເມື່ອພົບ "ວ" ຫຼັງ "ສ" ແລະ ຕາມດ້ວຍ "ຍ"
    // currentWord = "ສຶ່ງສ" => words = ["ສຶ່ງ"], currentWord = "ສວ"
    if ((char === 'ວ' || char === 'ອ') && currentWord.length > 0) {
      const lastCharIsConsonant = LAO_CONSONANTS.has(lastCharOfCurrentWord);
      const nextCharIsConsonant = nextChar && isLaoCharacter(nextChar) && LAO_CONSONANTS.has(nextChar);
      
      if (lastCharIsConsonant && nextCharIsConsonant) {
        currentWord = handleVaOrOSequence(currentWord, char, words);
        continue;
      }
    }
    
    // DEFAULT: Append character if no special cases matched
    // ຕົວຢ່າງເມື່ອບໍ່ກົງກັບເງື່ອນໄຂໃດໆຂ້າງເທິງ
    // "ປະ" ເມື່ອພົບ "ປ" ຕາມດ້ວຍ "ະ" => currentWord = "ປະ"
    currentWord += char;
  }
  
  // Add the last remaining word after the loop finishes
  // ຕົວຢ່າງ: ຄຳສຸດທ້າຍທີ່ຍັງເຫຼືອຫຼັງຈາກຈົບ loop
  // "ປະເທດລາວ" => words = ["ປະ", "ເທດ", "ລາວ"]
  if (currentWord.length > 0) {
    words.push(currentWord);
  }
  
  // Filter out any empty strings
  return words.filter(word => word.length > 0);
}