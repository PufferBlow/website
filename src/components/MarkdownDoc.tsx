import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";

import { resolveDocLink } from "../docs/links";

interface MarkdownDocProps {
  source: string;
  currentSlug: string;
}

export default function MarkdownDoc({ source, currentSlug }: MarkdownDocProps) {
  const components: Components = {
    a({ href, children, ...rest }) {
      if (!href) return <a {...rest}>{children}</a>;
      const resolved = resolveDocLink(currentSlug, href);
      if (resolved.external || resolved.href.startsWith("#")) {
        const isHttp = /^https?:/i.test(resolved.href);
        return (
          <a
            href={resolved.href}
            {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...rest}
          >
            {children}
          </a>
        );
      }
      return (
        <Link to={resolved.href} {...(rest as Record<string, unknown>)}>
          {children}
        </Link>
      );
    },
  };

  return (
    <article className="docs-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={components}
      >
        {source}
      </ReactMarkdown>
    </article>
  );
}
