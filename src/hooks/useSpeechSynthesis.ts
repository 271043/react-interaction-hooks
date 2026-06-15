import { useState, useEffect, useCallback } from "react";

interface UseSpeechSynthesisReturn {
  supported: boolean;
  speaking: boolean;
  voices: SpeechSynthesisVoice[];
  speak: (text: string, options?: SpeechSynthesisUtteranceInit) => void;
  cancel: () => void;
}

interface SpeechSynthesisUtteranceInit {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

/**
 * Returns {supported, speaking, voices, speak, cancel} for browser text-to-speech (Web Speech API).
 *
 * @returns Object with supported boolean, speaking boolean, voices array, speak(text, options?), cancel().
 */
export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const supported = typeof window.speechSynthesis !== "undefined" && !!window.speechSynthesis;
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener("voiceschanged", load);
    return () => synth.removeEventListener("voiceschanged", load);
  }, [supported]);

  const speak = useCallback((text: string, options: SpeechSynthesisUtteranceInit = {}) => {
    if (!supported || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (options.voice) utterance.voice = options.voice;
    if (options.rate !== undefined) utterance.rate = options.rate;
    if (options.pitch !== undefined) utterance.pitch = options.pitch;
    if (options.volume !== undefined) utterance.volume = options.volume;
    if (options.lang) utterance.lang = options.lang;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const cancel = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { supported, speaking, voices, speak, cancel };
}
