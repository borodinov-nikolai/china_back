
interface Word {
  wordOnChinese: string;
  wordOnRu: string;
  wordOnEn: string;
}
export function getRandomWords(words: Word[], count: number): Word[] {
  if (words.length <= count) {
    return words;
  }

  const shuffledWords = [...words];
  for (let i = shuffledWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
  }

  return shuffledWords.slice(0, count);
}
