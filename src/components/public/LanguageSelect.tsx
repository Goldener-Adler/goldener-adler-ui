import type {FunctionComponent} from "react";
import {defaultLanguage, type Language} from "@/assets/i18n/i18n.ts";
import {useTranslation} from "react-i18next";
import {NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuLink, NavigationMenu, NavigationMenuList} from "@/components/ui/navigation-menu.tsx";

interface LanguageSelectProps {
  isTop: boolean;
}

type KeysUnion<U extends string, R extends unknown[] = []> = {
  [S in U]: Exclude<U, S> extends never
    ? [...R, S]
    : KeysUnion<Exclude<U, S>, [...R, S]>;
}[U];

const languageKeys: KeysUnion<Language> = ['en', 'de'] as const;

type I18nToSelectItems = Record<(typeof languageKeys)[number], string>;

export const LanguageSelect: FunctionComponent<LanguageSelectProps> = ({isTop}) => {
  const { t, i18n } = useTranslation();
  const languages: I18nToSelectItems = {
    en: t('public.Languages.English'),
    de: t('public.Languages.German')
  } as const;
  
  const handleChange = (selectedLanguage: keyof typeof languages) => {
    i18n.changeLanguage(selectedLanguage);
  }
  
  const defaultLanguageItem = languages[defaultLanguage];
  
  const currentLanguage = !i18n.resolvedLanguage ? {name: defaultLanguageItem} : {name: i18n.resolvedLanguage.toUpperCase()};
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={`transition-colors ${isTop ? "bg-transparent text-white" : "bg-inherit"}`}>{currentLanguage.name}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul>
              {languageKeys.map((key, index) => (
                <li key={index}>
                  <NavigationMenuLink onClick={() => handleChange(key)} asChild>
                    <div className="text-sm leading-none font-medium">{languages[key]}</div>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
