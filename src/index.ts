/**
 * Main entry point for the Lao Word Splitter library.
 * This file exports the main function for splitting Lao text into words.
 */

// Import the LaoWordSplitter class
import { LaoWordSplitter } from './LaoWordSplitter';

// Create a singleton instance of LaoWordSplitter
const splitter = new LaoWordSplitter();

/**
 * Splits a Lao language sentence into individual words.
 * This is the main function that users of the library will interact with.
 * 
 * @param sentence - The Lao text to be split into words
 * @returns An array of words extracted from the input sentence
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const words = splitLao("ສະບາຍດີ"); // Returns ["ສະ", "ບາຍ", "ດີ"]
 * 
 * // Handling complex cases
 * const complexWords = splitLao("ປະເທດລາວເປັນສິ່ງສວຍງາມ");
 * // Returns ["ປະ", "ເທດ", "ລາວ", "ເປັນ", "ສິ່ງ", "ສວຍ", "ງາມ"]
 * 
 * // Handling mixed content
 * const mixedWords = splitLao("ພາສາລາວ 101"); // Returns ["ພາ", "ສາ", "ລາວ", "101"]
 * ```
 */
export function splitLao(sentence: string): string[] {
  return splitter.split(sentence);
}