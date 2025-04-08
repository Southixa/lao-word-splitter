/**
 * Splits Lao text into individual words.
 * A class for splitting Lao text into individual words.
 * This class handles various Lao language specific rules for word segmentation,
 * including consonant clusters, leading vowels, and special character sequences.
 */
export class LaoWordSplitter {
    // Basic consonants (Consonants)
    private readonly LAO_CONSONANTS = new Set([
      'ກ', 'ຂ', 'ຄ', 'ງ', 'ຈ', 'ສ', 'ຊ', 'ຍ', 'ດ', 'ຕ', 'ຖ', 'ທ', 'ນ',
      'ບ', 'ປ', 'ຜ', 'ຝ', 'ພ', 'ຟ', 'ມ', 'ຢ', 'ຣ', 'ລ', 'ວ', 'ຫ', 'ອ', 'ຮ',
      'ໜ', 'ໝ' // Considered distinct consonants
    ]);
  
    // Characters indicating a potential new word start
    // Examples: ເກມ, ແປ, ໂຕ, ໄປ, ໃນ - These often mark the beginning of a new word
    private readonly LEADING_VOWELS = new Set(['ເ', 'ແ', 'ໂ', 'ໄ', 'ໃ']);
  
    // Mid-word characters: vowels, tones, etc.
    // Examples: ກະ, ນາ, ດິນ, ຊີມ, ກຶກ, ປື, ຮຸກ, ງູ, etc.
    private readonly MIDDLE_CHARS = new Set([
      'ະ', 'າ', 'ິ', 'ີ', 'ຶ', 'ື', 'ຸ', 'ູ', // Base vowels
      'ໍ', // Vowel O / AM
      'ຳ', // Vowel AM (also often acts as middle)
      '່', '້', '໊', '໋', // Tones
      'ຼ', // Ligation mark (LO)
      '໌', // Cancellation mark (KAN)
      'ຽ', // Vowel IA
      'ັ', // Vowel sign MAI KANG
      'ົ' // Vowel sign MAI KON
    ]);
  
    // Consonants that can follow 'ຫ' to form a digraph
    // Examples: ຫງາຍ, ຫຍ້າ, ຫຼາຍ, ຫວ້າ, ຫຣິດ
    private readonly DIGRAPH_FOLLOWERS = new Set(['ງ', 'ຍ', 'ລ', 'ວ', 'ຣ']);
  
    // Special character that always forms its own word
    // Example: ແດງໆ - 'ໆ' is always treated as a separate word
    private readonly MAI_YAMOK = 'ໆ';
  
    /**
     * Checks if a character is part of Lao script
     *
     * Examples:
     * isLaoCharacter('ກ') => true
     * isLaoCharacter('a') => false
     * isLaoCharacter('1') => false
     */
    private isLaoCharacter(char: string): boolean {
      if (!char) return false;
      const charCode = char.charCodeAt(0);
      // Lao Unicode block: U+0E80 to U+0EFF
      return charCode >= 0x0E80 && charCode <= 0x0EFF;
    }
  
    /**
     * Helper function to add a word to the result array and start a new word
     *
     * Examples:
     * addWordToResult('ປະ', words, 'ເ') => 'ເ' and words = ['ປະ']
     * addWordToResult('ລາວ', words, 'ເ') => 'ເ' and words = ['ປະ', 'ລາວ']
     */
    private addWordToResult(currentWord: string, resultArray: string[], newWord: string = ''): string {
      if (currentWord.length > 0) {
        resultArray.push(currentWord);
      }
      return newWord;
    }
  
    /**
     * Helper function to handle consonant + 'ວ' sequences
     *
     * Examples:
     * "ຈົນກວ່າຈະ" when encountering '່' after 'ກວ':
     * handleConsonantVSequence('ຈົນກວ', '່', words) => 'ກວ່' and words = ['ຈົນ']
     *
     * "ຄວາມຮັກ" when encountering 'າ' after 'ຄວ':
     * handleConsonantVSequence('ຄວ', 'າ', words) => 'ຄວາ' and words = []
     *
     * "ຂວາງາມ" when encountering 'າ' after 'ຂວ':
     * handleConsonantVSequence('ຂວ', 'າ', words) => 'ຂວາ' and words = []
     */
    private handleConsonantVSequence(currentWord: string, char: string, resultArray: string[]): string {
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
     * Helper function to handle consonant + 'ຣ' sequences
     *
     * Examples:
     * "ທຣັມ" when encountering 'ັ' after 'ຣ':
     * handleConsonantRSequence('ທຣ', 'ັ', words) => 'ທຣັ' and words = []
     *
     * "ປຣິນເຕີ" when encountering 'ິ' after 'ຣ':
     * handleConsonantRSequence('ປຣ', 'ິ', words) => 'ປຣິ' and words = []
     *
     * "ກຣາມ" when encountering 'າ' after 'ຣ':
     * handleConsonantRSequence('ກຣ', 'າ', words) => 'ກຣາ' and words = []
     */
    private handleConsonantRSequence(currentWord: string, char: string, resultArray: string[]): string {
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
     * Helper function to handle digraphs with 'ຫ'
     *
     * Examples:
     * "ຫວານຫລາຍ" when encountering 'າ' after 'ຫວ':
     * handleDigraphSequence('ຫວ', 'າ', words) => 'ຫວາ' and words = []
     */
    private handleDigraphSequence(currentWord: string, char: string, resultArray: string[]): string {
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
     * Helper function to handle regular middle character processing
     *
     * Examples:
     * "ເທດລາວ" when encountering 'າ' after 'ລ':
     * handleRegularMiddleChar('ເທດລ', 'າ', words) => 'ລາ' and words = ['ເທດ']
     */
    private handleRegularMiddleChar(currentWord: string, char: string, resultArray: string[]): string {
      const lastChar = currentWord[currentWord.length - 1];
      const wordWithoutLast = currentWord.slice(0, -1);
      
      if (wordWithoutLast.length > 0) {
        resultArray.push(wordWithoutLast);
      }
      return lastChar + char;
    }
  
    /**
     * Helper function to handle 'ວ' or 'ອ' between consonants
     *
     * Examples:
     * "ສຶ່ງສວຍງາມ" when encountering "ວ" after "ສ" and followed by "ຍ":
     * handleVaOrOSequence('ສຶ່ງສ', 'ວ', words) => 'ສວ' and words = ['ສຶ່ງ']
     */
    private handleVaOrOSequence(currentWord: string, char: string, resultArray: string[]): string {
      const lastConsonant = currentWord.slice(-1);
      const wordWithoutLast = currentWord.slice(0, -1);
      
      if (wordWithoutLast.length > 0) {
        resultArray.push(wordWithoutLast);
      }
      return lastConsonant + char;
    }
  
    /**
     * Remove Zero Width Spaces
     *
     * Examples:
     * removeZeroWidthSpaces("ສະ​ບາຍ​ດີ") => "ສະບາຍດີ"
     */
    private removeZeroWidthSpaces(text: string): string {
      return text.replace(/\u200B/g, '');
    }
  
    /**
     * Splits a Lao language sentence into individual words based on syllable structure rules.
     *
     * @param sentence The Lao sentence to be segmented.
     * @returns An array of segmented words.
     *
     * Examples:
     * splitLao("ປະເທດລາວເປັນສິ່ງສວຍງາມ") => ["ປະ", "ເທດ", "ລາວ", "ເປັນ", "ສິ່ງ", "ສວຍ", "ງາມ"]
     * splitLao("ຈົນກວ່າຈະ") => ["ຈົນ", "ກວ່າ", "ຈະ"]
     * splitLao("ຫວຽດນາມ") => ["ຫວຽດ", "ນາມ"]
     * splitLao("ພາສາລາວ 101") => ["ພາ", "ສາ", "ລາວ", "101"]
     */
    public split(sentence: string): string[] {
      // Handle empty input
      if (!sentence || sentence.trim().length === 0) {
        return [];
      }
      
      // Preprocessing: remove zero width spaces
      // Example: "ສະ​ບາຍ​ດີ" => "ສະບາຍດີ"
      sentence = this.removeZeroWidthSpaces(sentence);
      
      const words: string[] = [];
      let currentWord = '';
      
      for (let i = 0; i < sentence.length; i++) {
        const char = sentence[i];
        // Get context for current character
        // Example 1: In sentence "ປະເທດລາວ" at index 3 (character 'ທ'):
        // - char = 'ທ'
        // - currentCharIsLao = true (ທ is a Lao character)
        // - lastCharOfCurrentWord = 'ເ' (last character of currentWord "ເ")
        // - lastCharWasLao = true (ເ is a Lao character)
        // - secondLastChar = '' (no second character because currentWord = "ເ" has only one character)
        // - nextChar = 'ດ' (next character is 'ດ')
        const currentCharIsLao = this.isLaoCharacter(char);
        const lastCharOfCurrentWord = currentWord.length > 0 ? currentWord[currentWord.length - 1] : '';
        const lastCharWasLao = this.isLaoCharacter(lastCharOfCurrentWord);
        const secondLastChar = currentWord.length > 1 ? currentWord[currentWord.length - 2] : '';
        const nextChar = i + 1 < sentence.length ? sentence[i + 1] : null;
  
        // --------- GUARD CONDITIONS ---------
        // GUARD: Space character - add current word and reset
        // Example: "ພາສາລາວ 101" when encountering space after "ລາວ"
        // currentWord = "ລາວ" => words = ["ພາ", "ສາ", "ລາວ"], currentWord = ""
        if (char === ' ') {
          currentWord = this.addWordToResult(currentWord, words);
          continue;
        }
  
        // GUARD: Non-Lao character processing
        if (!currentCharIsLao) {
          // Transition from Lao to non-Lao
          // Example: "ພາສາລາວ 101" when encountering "1" after space
          // currentWord = "" => words = ["ພາ", "ສາ", "ລາວ"], currentWord = "1"
          if (lastCharWasLao) {
            currentWord = this.addWordToResult(currentWord, words, char);
            continue;
          }
          // If both current and last char are non-Lao, just append
          // Example: "ພາສາລາວ 101" when encountering "0" after "1"
          // currentWord = "1" => currentWord = "10"
          currentWord += char;
          continue;
        }
  
        // --- Lao character processing ---
        // GUARD: Mai Yamok ('ໆ') - Always treat as separate word
        // Example: "ແດງໆ" when encountering "ໆ" after "ງ"
        // currentWord = "ແດງ" => words = ["ແດງ"], currentWord = "ໆ"
        if (char === this.MAI_YAMOK) {
          currentWord = this.addWordToResult(currentWord, words, this.MAI_YAMOK);
          continue;
        }
        
        // GUARD: Leading vowels start a new word
        // Example: "ປະເທດລາວ" when encountering "ເ" after "ະ"
        // currentWord = "ປະ" => words = ["ປະ"], currentWord = "ເ"
        if (this.LEADING_VOWELS.has(char)) {
          // Special case: Don't split on second 'ເ' if previous char was also 'ເ'
          // Example: "ເເຕກຕ່າງ" when encountering second "ເ" after first "ເ"
          // currentWord = "ເ" => currentWord = "ເເ"
          if (char === 'ເ' && lastCharOfCurrentWord === 'ເ') {
            currentWord += char;
            continue;
          }
          currentWord = this.addWordToResult(currentWord, words, char);
          continue;
        }
        
        // GUARD: Transition from non-Lao to Lao
        // Example: "RFA ລາວ" when encountering "ລ" after space
        // currentWord = "" => words = ["RFA"], currentWord = "ລ"
        if (!lastCharWasLao && currentWord.length > 0) {
          currentWord = this.addWordToResult(currentWord, words, char);
          continue;
        }
        
        // GUARD: Handle middle characters (vowels, tones, etc.)
        if (this.MIDDLE_CHARS.has(char)) {
          // If current word is empty, start a new word with this middle char
          // Example: "າ" when starting with a vowel (unusual case)
          // currentWord = "" => currentWord = "າ"
          if (currentWord.length === 0) {
            currentWord = char;
            continue;
          }
          
          // Check if we should simply append the middle character
          // 1. Case: middle character after middle character: "ສຶ່" when encountering "່" after "ຶ" => "ສຶ່"
          // 2. Case: leading vowel followed by consonant: "ເປ" when encountering "ັ" after "ປ" with "ເ" at start => "ເປັ"
          const shouldAppendMiddleChar = 
            this.MIDDLE_CHARS.has(lastCharOfCurrentWord) || 
            (char === 'ັ' && currentWord.length >= 2 && this.LEADING_VOWELS.has(secondLastChar));
            
          if (shouldAppendMiddleChar) {
            currentWord += char;
            continue;
          }
          
          // GUARD: Special case for consonant + 'ວ' sequences (ກວ, ຂວ, ຄວ)
          // Examples: 
          // - "ຈົນກວ່າຈະ" when encountering "່" after "ວ" preceded by "ກ"
          // - "ຄວາມຮັກ" when encountering "າ" after "ວ" preceded by "ຄ"
          // - "ຂວາງາມ" when encountering "າ" after "ວ" preceded by "ຂ"
          if (currentWord.length >= 2 && lastCharOfCurrentWord === 'ວ' && 
              (secondLastChar === 'ກ' || secondLastChar === 'ຂ' || secondLastChar === 'ຄ')) {
            currentWord = this.handleConsonantVSequence(currentWord, char, words);
            continue;
          }
          
          // GUARD: Special case for consonant + 'ຣ' sequences (ທຣ, ປຣ, ກຣ, ບຣ, ຟຣ)
          if (currentWord.length >= 2 && lastCharOfCurrentWord === 'ຣ' && 
              (secondLastChar === 'ທ' || secondLastChar === 'ປ' || secondLastChar === 'ກ' || 
               secondLastChar === 'ບ' || secondLastChar === 'ຟ')) {
            currentWord = this.handleConsonantRSequence(currentWord, char, words);
            continue;
          }
          
          // GUARD: Special case for digraphs with 'ຫ'
          // Example: "ຫວຽດນາມ" when encountering "ຽ" after "ວ" preceded by "ຫ"
          // currentWord = "ຫວ" => words = [], currentWord = "ຫວຽ"
          if (currentWord.length >= 2 && secondLastChar === 'ຫ' && this.DIGRAPH_FOLLOWERS.has(lastCharOfCurrentWord)) {
            currentWord = this.handleDigraphSequence(currentWord, char, words);
            continue;
          }
          
          // GUARD: Regular middle char handling - check if we need to split
          // Example: "ເທດລາວ" when encountering "າ" after "ລ"
          // Check if "ລ" is a consonant and "ເທດ" is not a leading vowel followed by consonant
          // currentWord = "ເທດລ" => words = ["ເທດ"], currentWord = "ລາ"
          const isLastCharConsonant = this.LAO_CONSONANTS.has(lastCharOfCurrentWord);
          const isSecondLastLeadingVowel = currentWord.length >= 2 && this.LEADING_VOWELS.has(secondLastChar);
          
          if (isLastCharConsonant && !isSecondLastLeadingVowel) {
            currentWord = this.handleRegularMiddleChar(currentWord, char, words);
          } else {
            // Append in other cases
            currentWord += char;
          }
          continue;
        }
        
        // GUARD: Special check for 'ວ' or 'ອ' between consonants
        // Example: "ສຶ່ງສວຍງາມ" when encountering "ວ" after "ສ" and followed by "ຍ"
        // currentWord = "ສຶ່ງສ" => words = ["ສຶ່ງ"], currentWord = "ສວ"
        if ((char === 'ວ' || char === 'ອ') && currentWord.length > 0) {
          const lastCharIsConsonant = this.LAO_CONSONANTS.has(lastCharOfCurrentWord);
          const nextCharIsConsonant = nextChar && this.isLaoCharacter(nextChar) && this.LAO_CONSONANTS.has(nextChar);
          
          if (lastCharIsConsonant && nextCharIsConsonant) {
            currentWord = this.handleVaOrOSequence(currentWord, char, words);
            continue;
          }
        }
        
        // DEFAULT: Append character if no special cases matched
        // Example when no conditions above match
        // "ປະ" when encountering "ປ" followed by "ະ" => currentWord = "ປະ"
        currentWord += char;
      }
      
      // Add the last remaining word after the loop finishes
      // Example: Last word remaining after loop ends
      // "ປະເທດລາວ" => words = ["ປະ", "ເທດ", "ລາວ"]
      if (currentWord.length > 0) {
        words.push(currentWord);
      }
      
      // Filter out any empty strings
      return words.filter(word => word.length > 0);
    }
  }