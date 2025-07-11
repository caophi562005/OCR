import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Tắt rule này
      "@typescript-eslint/no-unused-vars": "off", // Tắt rule này
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "react-hooks/rules-of-hooks": "off",
    },
  },
];

export default eslintConfig;
