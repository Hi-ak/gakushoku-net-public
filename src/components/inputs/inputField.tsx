"use client";
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
} from "react";
import styles from "@/common/styles/components/inputs/input.module.scss";

// 汎用 input
export const InputField = forwardRef<
  HTMLInputElement,
  {
    defaultVal?: string;
    value?: string;
    readOnly?: boolean;
    type?: "number" | "text" | "password" | "email" | "tel" | "url" | "date";
    name?: string;
    id?: string;
    className?: string;
    placeHolder?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
  }
>(function InputField(
  {
    name,
    id,
    type = "text",
    defaultVal,
    className: customClassName,
    placeHolder,
    onChange,
    onBlur,
    value,
    readOnly,
  },
  ref
) {
  return (
    <input
      value={value}
      readOnly={readOnly}
      ref={ref}
      type={type}
      name={name}
      id={id}
      defaultValue={defaultVal}
      placeholder={placeHolder}
      className={[styles.inputField, customClassName].join(" ")}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
});
