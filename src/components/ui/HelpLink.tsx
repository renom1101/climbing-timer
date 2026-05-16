import classNames from "classnames";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

type Props = {
  sectionId?: string;
  label?: string;
  className?: string;
  iconClassName?: string;
};

const HelpLink = ({
  sectionId,
  label = "Open help",
  className,
  iconClassName,
}: Props) => {
  const baseLink =
    typeof window === "undefined"
      ? "/help.html"
      : `${window.location.origin}/help.html`;
  const href = sectionId ? `${baseLink}#${sectionId}` : baseLink;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={classNames(
        "inline-flex items-center text-text hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className
      )}
    >
      <QuestionMarkCircleIcon
        aria-hidden="true"
        className={classNames("h-5 w-5", iconClassName)}
      />
    </a>
  );
};

export default HelpLink;
