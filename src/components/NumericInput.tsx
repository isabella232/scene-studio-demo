import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function NumericInput({
  label,
  value,
  onBlur,
  ...inputProps
}: Props): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current != null) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && inputRef.current != null) {
      inputRef.current.value = value?.toString() || "";
    }
  }, [isEditing, value]);

  return (
    <div className="w-full relative flex items-center">
      {label && <div className="pr-2">{label}</div>}
      <div className="relative flex flex-grow">
        <input
          ref={inputRef}
          tabIndex={isEditing ? -1 : undefined}
          className={classNames(
            "w-0 h-full flex-grow border-neutral-400 border rounded",
            {
              "text-neutral-700": !inputProps.disabled,
              "text-neutral-400": !!inputProps.disabled,
            }
          )}
          type="number"
          {...inputProps}
          defaultValue={value}
          onFocus={() => {
            setIsEditing(true);
          }}
          onBlur={(event) => {
            setIsEditing(false);
            if (onBlur) onBlur(event);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
        />
      </div>
    </div>
  );
}
