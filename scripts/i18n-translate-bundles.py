#!/usr/bin/env python3
"""Translate messages/en/*.json to target locales using deep-translator (Google)."""
import json
import os
import sys
import time

ROOT = os.path.join(os.path.dirname(__file__), "..", "messages")


def translate_tree(tr, obj, delay_s: float = 0.08):
    if isinstance(obj, dict):
        return {k: translate_tree(tr, v, delay_s) for k, v in obj.items()}
    if isinstance(obj, list):
        return [translate_tree(tr, v, delay_s) for v in obj]
    if isinstance(obj, str):
        if not obj.strip():
            return obj
        for attempt in range(5):
            try:
                out = tr.translate(obj)
                time.sleep(delay_s)
                return out
            except Exception:
                time.sleep(1.2 * (attempt + 1))
        return obj
    return obj


def run(locale: str, lang: str, parts: list[str]):
    from deep_translator import GoogleTranslator

    tr = GoogleTranslator(source="en", target=lang)
    for name in parts:
        src = os.path.join(ROOT, "en", f"{name}.json")
        dst = os.path.join(ROOT, locale, f"{name}.json")
        with open(src, encoding="utf-8") as f:
            data = json.load(f)
        out = translate_tree(tr, data)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with open(dst, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print("wrote", dst, file=sys.stderr)


if __name__ == "__main__":
    # Usage: python scripts/i18n-translate-bundles.py fr fr dashboard marketing legal
    if len(sys.argv) < 4:
        print(
            "usage: i18n-translate-bundles.py <locale> <lang> <part> [<part> ...]",
            file=sys.stderr,
        )
        sys.exit(1)
    locale, lang = sys.argv[1], sys.argv[2]
    parts = sys.argv[3:]
    run(locale, lang, parts)
