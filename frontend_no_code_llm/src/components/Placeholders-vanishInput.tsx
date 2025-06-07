"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

interface PlaceholdersAndVanishInputDemoProps {
  onSubmitText?: (text: string) => void;
}

export function PlaceholdersAndVanishInputDemo({ onSubmitText }: PlaceholdersAndVanishInputDemoProps) {
  const placeholders = [
    "Type what's in your mind. We'll code it for you ✨",
    "Describe it like you're texting a friend – we'll handle the rest 💻",
    "Use natural language. No code needed. We speak 'idea' fluently 💬",
    "From idea → to UI. Tell us what to build 🛠️",
    "Describe your site → We’ll turn it into code.✨",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>, inputValue: string) => {
    e.preventDefault();
    console.log("submitted", inputValue);
    if (onSubmitText && inputValue.trim()) {
      onSubmitText(inputValue.trim());
    }
  };
  return (
    <div className="flex flex-col justify-center items-center mb-8 pt-10">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
