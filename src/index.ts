/**
 * ແຍກປະໂຫຍກພາສາລາວອອກເປັນແຕ່ລະຄຳ.
 * Splits a Lao language sentence into individual words based on syllable structure rules.
 *
 * @param sentence ປະໂຫຍກພາສາລາວທີ່ຕ້ອງການແຍກ / The Lao sentence to be segmented.
 * @returns Array ຂອງຄຳສັບທີ່ແຍກອອກມາ / An array of segmented words.
 */
export function splitLao(sentence: string): string[] {
    if (!sentence || sentence.trim().length === 0) {
      return [];
    }

    // Remove Zero Width Spaces (U+200B) which can interfere with segmentation
    sentence = sentence.replace(/\u200B/g, '');

    // Character Sets based on detailed explanation
    // ຕົວອັກສອນພື້ນຖານ (Consonants)
    const laoConsonants = new Set([
      'ກ', 'ຂ', 'ຄ', 'ງ', 'ຈ', 'ສ', 'ຊ', 'ຍ', 'ດ', 'ຕ', 'ຖ', 'ທ', 'ນ',
      'ບ', 'ປ', 'ຜ', 'ຝ', 'ພ', 'ຟ', 'ມ', 'ຢ', 'ຣ', 'ລ', 'ວ', 'ຫ', 'ອ', 'ຮ',
      'ໜ', 'ໝ' // Considered distinct consonants
    ]);

    // ຕົວອັກສອນທີ່ບົ່ງບອກວ່າອາດຈະເລີ່ມຕົ້ນຄຳໃໝ່ (Characters indicating a potential new word start)
    // Note: Non-Lao characters also trigger a start implicitly in the logic below
    const startChars = new Set(['ເ', 'ແ', 'ໂ', 'ໄ', 'ໃ']); // Removed space, handled separately

    // ຕົວອັກສອນກາງຄຳ/ສະຫຼະ/ວັນນະຍຸດ (Mid-word characters: vowels, tones, etc.)
    // Based on user's list: ['ະ', 'າ', 'ິ', 'ີ', 'ຶ', 'ື', 'ຸ', 'ູ', 'ໍ', 'ຼ', '໊', 'ັ', 'ົ', '່', '້', '໋', '໌', 'ຽ', 'າ']
    const middleChars = new Set([
      'ະ', 'າ', 'ິ', 'ີ', 'ຶ', 'ື', 'ຸ', 'ູ', // Base vowels
      'ໍ', // Vowel O / AM
      'ຳ', // Vowel AM (also often acts as middle)
      '່', '້', '໊', '໋', // Tones
      'ຼ', // Ligation mark (LO)
      '໌', // Cancellation mark (KAN)
      'ຽ', // Vowel IA
      'ັ', // Vowel sign MAI KANG
      'ົ'  // Vowel sign MAI KON
      // Note: User list had 'າ' twice. Added 'ຳ' here as it functions similarly in middle.
    ]);

    // Leading Vowels (for checking with 'ັ')
    // Based on user's list: ['ເ', 'ແ', 'ໂ', 'ໄ'] - adding 'ໃ' as it's a leading vowel too.
    const leadingVowels = new Set(['ເ', 'ແ', 'ໂ', 'ໄ', 'ໃ']);

    // Consonants used for the 'ວ'/'ອ' split check
    // Based on user's list: [ກ ຂ ຄ ງ ຈ ສ ຊ ຍ ດ ຕ ຖ ທ ນ ບ ປ ຜ ຝ ພ ຟ ມ ຢ ຣ ລ ວ ຫ ອ ຮ ໝ ໜ]
    const consonantsForVaOCheck = laoConsonants; // Same as the main consonant list provided

    // Consonants that can follow 'ຫ' to form a digraph
    const digraphFollowers = new Set(['ງ', 'ຍ', 'ລ', 'ວ', 'ຣ']); // Note: ຫຮ is rare/archaic, excluding for now unless needed

    let arrayWord: string[] = [];
    let currentWord = '';

    // Helper function to check if a character is part of Lao script (basic range)
    function isLaoCharacter(char: string): boolean {
      if (!char) return false;
      const charCode = char.charCodeAt(0);
      // Lao Unicode block: U+0E80 to U+0EFF
      return charCode >= 0x0E80 && charCode <= 0x0EFF;
    }

    for (let i = 0; i < sentence.length; i++) {
      const char = sentence[i];

      // --- 0. Special Check for Mai Yamok ('ໆ') --- Always treat as separate word
      if (char === 'ໆ') {
          if (currentWord.length > 0) {
              arrayWord.push(currentWord);
          }
          currentWord = 'ໆ'; // Start new word with just Mai Yamok
          continue; // Move to next character
      }

      const currentCharIsLao = isLaoCharacter(char);
      const lastCharOfCurrentWord = currentWord.length > 0 ? currentWord[currentWord.length - 1] : '';
      const lastCharWasLao = isLaoCharacter(lastCharOfCurrentWord);

      let foundStart = false;
      let foundMiddleSplit = false;
      let foundVaOSplit = false;

      // --- 1. Check for Start Conditions (Triggers pushing previous word) ---
      if (char === ' ') {
          foundStart = true;
      } else if (currentCharIsLao && startChars.has(char)) {
          // ເ, ແ, ໂ, ໄ, ໃ start a new Lao syllable
          foundStart = true;
      } else if (!currentCharIsLao && lastCharWasLao) {
          // Transition from Lao to Non-Lao starts a new (non-Lao) word
          foundStart = true;
      } else if (currentCharIsLao && !lastCharWasLao && currentWord.length > 0) {
          // Transition from Non-Lao to Lao starts a new (Lao) word
          foundStart = true;
      }

      if (foundStart) {
          if (currentWord.length > 0) {
              arrayWord.push(currentWord);
          }
          currentWord = (char === ' ' ? '' : char); // Start new word, ignore space itself
          continue;
      }

      // If current char is non-Lao and last was also non-Lao, just append
      if (!currentCharIsLao && !lastCharWasLao) {
           currentWord += char;
           continue;
      }

      // --- 2. Check for Middle Conditions (May trigger split/append) ---
      if (currentCharIsLao && middleChars.has(char)) {
          if (currentWord.length === 0) {
              currentWord = char; // Start word if empty
          } else {
              const lastChar = lastCharOfCurrentWord; // Already fetched
              const secondLastChar = currentWord.length > 1 ? currentWord[currentWord.length - 2] : '';

              let shouldAppend = false;
              // Condition 1: Middle/Tone follows Middle/Tone (e.g., ສຶ + ່)
              if (middleChars.has(lastChar)) {
                  shouldAppend = true;
              }
              // Condition 2: Special Mai Kang (ັ) follows specific Leading Vowels (e.g., ເ + ປ + ັ)
              else if (char === 'ັ' && currentWord.length >= 2 && leadingVowels.has(secondLastChar)) {
                   shouldAppend = true;
              }

              if (shouldAppend) {
                  currentWord += char;
              } else {
                  // --- NEW 'ກວ' Check --- (e.g., ຈົນກວ + ່ -> split before ກວ, push ຈົນ, current = ກວ່)
                  let handledByKVSplit = false;
                  if (currentWord.length >= 2 && lastChar === 'ວ' && secondLastChar === 'ກ') {
                      const kvSequence = secondLastChar + lastChar; // 'ກວ'
                      const wordBeforeKV = currentWord.slice(0, -2);
                      if (wordBeforeKV.length > 0) {
                          arrayWord.push(wordBeforeKV);
                      }
                      currentWord = kvSequence + char; // Start new word with 'ກວ' + MiddleChar
                      handledByKVSplit = true;
                  }

                  if (!handledByKVSplit) {
                      // --- NEW Digraph Check --- (e.g., ຫວ + າ -> split before ຫວ, push previous, current = ຫວາ)
                      let handledByDigraphSplit = false;
                      if (currentWord.length >= 2 && secondLastChar === 'ຫ' && digraphFollowers.has(lastChar)) {
                          const digraph = secondLastChar + lastChar; // e.g., 'ຫວ'
                          const wordBeforeDigraph = currentWord.slice(0, -2);
                          if (wordBeforeDigraph.length > 0) {
                              arrayWord.push(wordBeforeDigraph);
                          }
                          currentWord = digraph + char; // Start new word with Digraph + MiddleChar
                          handledByDigraphSplit = true;
                      }

                      if (!handledByDigraphSplit) {
                          // --- Original Split/Append Logic --- (if not handled by digraph rule)
                          const isLastCharConsonant = laoConsonants.has(lastChar);
                          // Check if the consonant was preceded by a leading vowel (LV+C+M case)
                          const isSecondLastLeadingVowel = currentWord.length >= 2 && leadingVowels.has(secondLastChar);

                          if (isLastCharConsonant && !isSecondLastLeadingVowel) {
                              // Split condition: Consonant + Middle, where Consonant was NOT preceded by Leading Vowel
                              // Example: ເທດລ + າ -> Split before ລ, Push 'ເທດ', currentWord='ລາ'
                              const lastCharOnly = lastChar;
                              const wordWithoutLast = currentWord.slice(0, -1);
                              if (wordWithoutLast.length > 0) {
                                  arrayWord.push(wordWithoutLast);
                              }
                              currentWord = lastCharOnly + char; // Start new word: C + M
                          } else {
                              // Append in other cases:
                              // - Last char wasn't consonant (e.g., LV + M)
                              // - Last char was consonant BUT preceded by leading vowel (LV + C + M case - e.g., ເ + ຊ + ົ)
                              currentWord += char;
                          }
                      }
                  }
              }
          }
          continue; // Handled middle char, move to next iteration
      }

      // --- 3. Special Check for 'ວ' or 'ອ' (May trigger split) ---
      if (currentCharIsLao && (char === 'ວ' || char === 'ອ') && currentWord.length > 0) {
          const lastChar = lastCharOfCurrentWord; // Already fetched
          const nextChar = i + 1 < sentence.length ? sentence[i + 1] : null;
          const lastCharIsConsonant = consonantsForVaOCheck.has(lastChar);
          const nextCharIsConsonant = nextChar && isLaoCharacter(nextChar) && consonantsForVaOCheck.has(nextChar);

          if (lastCharIsConsonant && nextCharIsConsonant) {
              // Split condition: C + V/O + C (like ສວຍ or ກອນ)
              // Example: ສ + ວ -> ສວ, next is 'ຍ' (consonant) -> split (currentWord was ສຶ່ງສ), push 'ສຶ່ງ', start 'ສວ'
               const lastConsonant = currentWord.slice(-1); // The consonant before V/O
               const wordWithoutLast = currentWord.slice(0, -1); // The word part before that consonant

              if (wordWithoutLast.length > 0) {
                  arrayWord.push(wordWithoutLast);
              }
              currentWord = lastConsonant + char; // Start new word part: Consonant + 'ວ'/'ອ'
              foundVaOSplit = true; // Mark that we split and handled the char
          }
           // Else: V/O doesn't meet split criteria, append handled by default logic later
           if (foundVaOSplit) continue; // Skip to next char if we split here
      }

      // --- 4. Default: Append Character ---
      // If the character didn't trigger a start, wasn't handled by middle split,
      // and wasn't handled by V/O split, append it to the current word.
      currentWord += char;
    }

    // Add the last remaining word after the loop finishes
    if (currentWord.length > 0) {
      arrayWord.push(currentWord);
    }

    // Filter out any potential empty strings that might have been added (e.g., from consecutive spaces)
    return arrayWord.filter(word => word.length > 0);
  }
