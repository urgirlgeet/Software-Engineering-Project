import { Link } from "expo-router";
import { type ComponentProps } from "react";

type ExternalLinkProps = ComponentProps<typeof Link>;

export function ExternalLink(props: ExternalLinkProps) {
  return <Link {...props} />;
}
