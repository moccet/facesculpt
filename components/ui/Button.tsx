import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "dark" | "light" | "outline" | "outlineLight";
type Size = "default" | "mini";

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type LinkProps = Common & { href: string } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className" | "children"
>;
type ButtonProps = Common & { href?: undefined } & Omit<
  ComponentProps<"button">,
  "className" | "children"
>;

function classes(variant: Variant, size: Size, extra?: string) {
  return [styles.btn, styles[variant], size === "mini" ? styles.mini : "", extra]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "dark", size = "default", className, children, ...rest } = props;
  const cls = classes(variant, size, className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as LinkProps;
    return (
      <Link href={href} className={cls} {...linkRest}>
        {children}
      </Link>
    );
  }
  const buttonRest = rest as Omit<ButtonProps, keyof Common>;
  return (
    <button type="button" className={cls} {...buttonRest}>
      {children}
    </button>
  );
}
