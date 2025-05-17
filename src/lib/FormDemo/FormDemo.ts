export function createEmailValidator() {
  let validStatus: "neutral" | "valid" | "invalid" = "neutral";
  let isFocused = false;

  const validateAttachment = (input: HTMLInputElement) => {
    const validateEmail = () => {
      const value = input.value;
      if (!value) {
        validStatus = "neutral";
        return;
      }

      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      validStatus = isValid ? "valid" : "invalid";
    };

    const handleFocus = () => {
      isFocused = true;
    };

    const handleBlur = () => {
      isFocused = false;
    };

    input.addEventListener("input", validateEmail);
    input.addEventListener("focus", handleFocus);
    input.addEventListener("blur", handleBlur);

    return () => {
      input.removeEventListener("input", validateEmail);
      input.removeEventListener("focus", handleFocus);
      input.removeEventListener("blur", handleBlur);
    };
  };

  return {
    validStatus,
    isFocused,
    validateAttachment,
  };
}
