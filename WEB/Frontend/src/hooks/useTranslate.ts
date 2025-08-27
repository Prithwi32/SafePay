import { useState, useCallback } from "react"
import { translations } from "../lib/translations"

type Lang = keyof typeof translations

export function useTranslate(defaultLang: Lang = "en") {
  const [lang, setLang] = useState<Lang>(defaultLang)

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const keys = key.split(".")
      let text: any = translations[lang]

      for (const k of keys) {
        if (text && typeof text === "object") {
          text = text[k]
        }
      }

      if (typeof text !== "string") return key

      if (vars) {
        return Object.entries(vars).reduce(
          (acc, [varKey, value]) =>
            acc.replace(new RegExp(`{{${varKey}}}`, "g"), String(value)),
          text
        )
      }

      return text
    },
    [lang]
  )

  return { t, lang, setLang }
}
