import {useState, useEffect, type ReactNode} from "react";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";

export const AppGuard = ({ children }: { children: ReactNode }) => {
  const {t} = useTranslation();
  const isStg = import.meta.env.VITE_ENV === "staging";
  const PASSWORD = import.meta.env.VITE_APP_PASSWORD;

  const [isAuthed, setIsAuthed] = useState(!isStg);

  useEffect(() => {
    if (isStg) {
      const stored = sessionStorage.getItem("stg-auth");
      if (stored === "true") setIsAuthed(true);
    }
  }, [isStg]);

  const handleAuth = () => {
    const input = prompt(t('internal.Guard.EnterMessage'));
    if (input === PASSWORD) {
      sessionStorage.setItem("stg-auth", "true");
      setIsAuthed(true);
    } else {
      alert(t('internal.Guard.PasswordIncorrect'));
    }
  };

  if (!isStg || isAuthed) return <>{children}</>;

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-bl/decreasing from-amber-100 to-orange-100 flex-col gap-3">
      <h1 className="text-2xl font-semibold">{t('internal.Guard.Title')}</h1>
      <Button
        onClick={handleAuth}
        size="lg"
      >
        {t('internal.Guard.EnterPassword')}
      </Button>
    </div>
  );
};
