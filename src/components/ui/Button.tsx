import { ReactNode, ButtonHTMLAttributes } from "react";
import classNames from "classnames";

enum ButtonStyling {
  Primary = "primary",
  Secondary = "secondary",
}

type Props = {
  styling?: ButtonStyling;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  styling = ButtonStyling.Primary,
  className,
  children,
  ...props
}: Props) {
  const stylingClasses =
    styling === ButtonStyling.Primary
      ? classNames("bg-lsf-green", "text-white", "hover:bg-lsf-green-light")
      : classNames(
          "bg-white",
          "text-lsf-green",
          "ring-1",
          "ring-inset",
          "ring-lsf-green",
          "hover:bg-gray-50"
        );
  return (
    <button
      {...props}
      type="button"
      className={classNames(
        "rounded-md",
        "px-3.5",
        "py-2.5",
        "text-sm",
        "font-medium",
        "shadow-sm",
        "focus-visible:outline",
        "focus-visible:outline-2",
        "focus-visible:outline-offset-2",
        "focus-visible:outline-lsf-green",
        stylingClasses,
        className
      )}
    >
      {children}
    </button>
  );
}

Button.Styling = ButtonStyling;

export default Button;
