import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";

type NestedStringObject = {
  [key: string]: string | NestedStringObject | NestedStringObject[];
};

export const useTranslatePage = <T extends NestedStringObject>(constantsObj: T) => {
  const { t } = useTranslation();
  const [translated, setTranslated] = useState<T>(constantsObj);
  const [translating, setTranslating] = useState(true);

  useEffect(() => {
    setTranslating(true);

    // flatten strings for bulk translation
    const flattenStrings = (obj: any): Record<string, string> => {
      const result: Record<string, string> = {};
      const traverse = (o: any, prefix = "") => {
        Object.entries(o).forEach(([key, val]) => {
          const newKey = prefix ? `${prefix}.${key}` : key;
          if (typeof val === "string") result[newKey] = val;
          else if (Array.isArray(val))
            val.forEach((item, idx) => traverse(item, `${newKey}[${idx}]`));
          else if (typeof val === "object" && val !== null) traverse(val, newKey);
        });
      };
      traverse(obj);
      return result;
    };

    const unflattenStrings = (flat: Record<string, string>): T => {
      const result = JSON.parse(JSON.stringify(constantsObj));
      const setValue = (path: string, value: string) => {
        const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
        let temp: any = result;
        keys.forEach((k, idx) => {
          if (idx === keys.length - 1) temp[k] = value;
          else temp = temp[k];
        });
      };
      Object.entries(flat).forEach(([k, v]) => setValue(k, v));
      return result;
    };

    const flat = flattenStrings(constantsObj);

    t(flat)
      .then((res) => setTranslated(unflattenStrings(res)))
      .catch((err) => {
        console.error("Translation error:", err);
        setTranslated(constantsObj);
      })
      .finally(() => setTranslating(false));
  }, [t, constantsObj]);

  return { translated, translating };
};
