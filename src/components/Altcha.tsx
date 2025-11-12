import {useEffect, useRef, useState, forwardRef, useImperativeHandle} from 'react'

/*
 * Credits: https://stackblitz.com/~/github.com/altcha-org/altcha-starter-react-ts?file=src/Altcha.tsx:L1-L51
 */

// Importing altcha package will introduce a new element <altcha-widget>
import 'altcha'
import "altcha/i18n/de";
import "altcha/i18n/en";
import {useTranslation} from "react-i18next";
import {IS_TEST_MODE} from "@/assets/consts.ts";

interface AltchaProps {
  onStateChange?: (payload: string | null) => void;
  onVerifying?: () => void;
  onVerified?: (payload: string) => void;
  onError?: () => void;
}

const Altcha = forwardRef<{ value: string | null }, AltchaProps>(({ onStateChange, onVerifying, onVerified, onError }, ref) => {
  const widgetRef = useRef<AltchaWidget & AltchaWidgetMethods & HTMLElement>(null)
  const [value, setValue] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useImperativeHandle(ref, () => {
    return {
      get value() {
        return value
      }
    }
  }, [value])

  useEffect(() => {
    const handleStateChange = (ev: Event | CustomEvent) => {
      if ('detail' in ev) {
        setValue(ev.detail.payload || null);
        onStateChange?.(ev.detail.payload);
        switch (ev.detail.state) {
          case "verifying": {
            onVerifying?.();
            break;
          }
          case "verified": {
            onVerified?.(ev.detail.payload);
            break;
          }
          case "error": {
            onError?.();
            break;
          }
        }
      }
    }

    const { current } = widgetRef

    if (current) {
      current.addEventListener('statechange', handleStateChange)
      return () => current.removeEventListener('statechange', handleStateChange)
    }
  }, [onStateChange])

  /* Configure your `challengeurl` and remove the `test` attribute, see docs: https://altcha.org/docs/v2/widget-integration/  */
  return (
    <altcha-widget
      ref={widgetRef}
      challengeurl={import.meta.env.VITE_ALTCHA_CHALLENGE_GENERATOR}
      language={i18n.language}
      floating
      floatingpersist
      floatinganchor="#submit-button"
      test={IS_TEST_MODE}
    ></altcha-widget>
  )
})

export default Altcha
