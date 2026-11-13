import { Fragment, useEffect, useRef, useState } from 'react';
import './App.css';

const ROW_HUES = [
  345, 15, 35, 90, 135, 165, 190, 215, 260, 300,
];

const KANA_ROWS = [
  [
    { hiragana: 'あ', katakana: 'ア', romaji: 'a' },
    { hiragana: 'い', katakana: 'イ', romaji: 'i' },
    { hiragana: 'う', katakana: 'ウ', romaji: 'u' },
    { hiragana: 'え', katakana: 'エ', romaji: 'e' },
    { hiragana: 'お', katakana: 'オ', romaji: 'o' },
  ],
  [
    { hiragana: 'か', katakana: 'カ', romaji: 'ka' },
    { hiragana: 'き', katakana: 'キ', romaji: 'ki' },
    { hiragana: 'く', katakana: 'ク', romaji: 'ku' },
    { hiragana: 'け', katakana: 'ケ', romaji: 'ke' },
    { hiragana: 'こ', katakana: 'コ', romaji: 'ko' },
  ],
  [
    { hiragana: 'さ', katakana: 'サ', romaji: 'sa' },
    { hiragana: 'し', katakana: 'シ', romaji: 'shi' },
    { hiragana: 'す', katakana: 'ス', romaji: 'su' },
    { hiragana: 'せ', katakana: 'セ', romaji: 'se' },
    { hiragana: 'そ', katakana: 'ソ', romaji: 'so' },
  ],
  [
    { hiragana: 'た', katakana: 'タ', romaji: 'ta' },
    { hiragana: 'ち', katakana: 'チ', romaji: 'chi' },
    { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu' },
    { hiragana: 'て', katakana: 'テ', romaji: 'te' },
    { hiragana: 'と', katakana: 'ト', romaji: 'to' },
  ],
  [
    { hiragana: 'な', katakana: 'ナ', romaji: 'na' },
    { hiragana: 'に', katakana: 'ニ', romaji: 'ni' },
    { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu' },
    { hiragana: 'ね', katakana: 'ネ', romaji: 'ne' },
    { hiragana: 'の', katakana: 'ノ', romaji: 'no' },
  ],
  [
    { hiragana: 'は', katakana: 'ハ', romaji: 'ha' },
    { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi' },
    { hiragana: 'ふ', katakana: 'フ', romaji: 'fu' },
    { hiragana: 'へ', katakana: 'ヘ', romaji: 'he' },
    { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho' },
  ],
  [
    { hiragana: 'ま', katakana: 'マ', romaji: 'ma' },
    { hiragana: 'み', katakana: 'ミ', romaji: 'mi' },
    { hiragana: 'む', katakana: 'ム', romaji: 'mu' },
    { hiragana: 'め', katakana: 'メ', romaji: 'me' },
    { hiragana: 'も', katakana: 'モ', romaji: 'mo' },
  ],
  [
    { hiragana: 'や', katakana: 'ヤ', romaji: 'ya' },
    null,
    { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu' },
    null,
    { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo' },
  ],
  [
    { hiragana: 'ら', katakana: 'ラ', romaji: 'ra' },
    { hiragana: 'り', katakana: 'リ', romaji: 'ri' },
    { hiragana: 'る', katakana: 'ル', romaji: 'ru' },
    { hiragana: 'れ', katakana: 'レ', romaji: 're' },
    { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro' },
  ],
  [
    { hiragana: 'わ', katakana: 'ワ', romaji: 'wa' },
    null,
    { hiragana: 'を', katakana: 'ヲ', romaji: 'wo' },
    null,
    { hiragana: 'ん', katakana: 'ン', romaji: 'n' },
  ],
];

function App() {
  const [activeKana, setActiveKana] = useState(null);
  const resetTimer = useRef(null);
  const pressId = useRef(0);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const clearResetTimer = () => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  };

  const handlePress = (kana) => {
    pressId.current += 1;
    const id = pressId.current;

    clearResetTimer();

    const canSpeak =
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance === 'function';

    if (canSpeak) {
      window.speechSynthesis.cancel();
    }

    setActiveKana(kana.hiragana);

    const reset = () => {
      if (pressId.current !== id) {
        return;
      }
      clearResetTimer();
      setActiveKana(null);
    };

    if (canSpeak) {
      const voices = window.speechSynthesis.getVoices();
      const japaneseVoice = voices.find((voice) =>
        voice.lang?.toLowerCase().startsWith('ja')
      );

      const utterance = new SpeechSynthesisUtterance(
        japaneseVoice ? kana.hiragana : kana.romaji
      );
      utterance.lang = japaneseVoice ? 'ja-JP' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.onend = reset;
      utterance.onerror = reset;

      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      }

      window.speechSynthesis.speak(utterance);
    }

    resetTimer.current = setTimeout(reset, 1100);
  };

  return (
    <main className="app">
      <h1 className="title">Hiragana</h1>
      <div className="kana-grid">
        {KANA_ROWS.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            {row.map((kana, columnIndex) => {
              if (!kana) {
                return (
                  <span
                    key={`empty-${rowIndex}-${columnIndex}`}
                    className="kana-placeholder"
                    aria-hidden="true"
                  />
                );
              }

              const isKatakana = activeKana === kana.hiragana;
              const displayed = isKatakana ? kana.katakana : kana.hiragana;

              return (
                <button
                  key={kana.hiragana}
                  type="button"
                  className={`kana-button${isKatakana ? ' is-katakana' : ''}`}
                  style={{ '--kana-hue': ROW_HUES[rowIndex] }}
                  onClick={() => handlePress(kana)}
                  aria-label={`${kana.romaji} (${displayed})`}
                >
                  {displayed}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
    </main>
  );
}

export default App;
