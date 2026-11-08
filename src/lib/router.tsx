import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

/**
 * A small hash router. The current page lives in React state; the URL hash
 * (`#/schedule?class=mma`) mirrors it, so the back button, bookmarks, and a
 * refresh all work on GitHub Pages, which can only serve index.html.
 */

type Location = { pathname: string; search: string };

type RouterValue = Location & {
  navigate: (href: string, options?: { replace?: boolean; scroll?: boolean }) => void;
};

const RouterContext = createContext<RouterValue | null>(null);

function readHash(): Location & { anchor: string } {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [beforeAnchor, anchor = ""] = raw.split("#");
  const [pathname, search = ""] = beforeAnchor.split("?");
  return { pathname: pathname || "/", search, anchor };
}

function scrollAfterRender(anchor: string, toTop: boolean) {
  requestAnimationFrame(() => {
    const target = anchor ? document.getElementById(anchor) : null;
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    else if (toTop) window.scrollTo(0, 0);
  });
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(() => {
    const { pathname, search } = readHash();
    return { pathname, search };
  });

  // Back/forward buttons and hand-edited URLs change the hash directly.
  useEffect(() => {
    const onHashChange = () => {
      const { pathname, search, anchor } = readHash();
      setLocation({ pathname, search });
      scrollAfterRender(anchor, true);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback<RouterValue["navigate"]>((href, options = {}) => {
    const [beforeAnchor, anchor = ""] = href.split("#");
    const [pathname, search = ""] = beforeAnchor.split("?");
    const nextHash = `#${pathname}${search ? `?${search}` : ""}${anchor ? `#${anchor}` : ""}`;

    if (options.replace) window.history.replaceState(null, "", nextHash);
    else window.history.pushState(null, "", nextHash);

    setLocation({ pathname, search });
    scrollAfterRender(anchor, options.scroll !== false);
  }, []);

  const value = useMemo(() => ({ ...location, navigate }), [location, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

function useRouterContext() {
  const value = useContext(RouterContext);
  if (!value) throw new Error("Router hooks must be used inside <RouterProvider>.");
  return value;
}

export function usePathname() {
  return useRouterContext().pathname;
}

export function useSearchParams() {
  const { search } = useRouterContext();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function useRouter() {
  const { navigate } = useRouterContext();
  return useMemo(
    () => ({
      push: (href: string, options?: { scroll?: boolean }) => navigate(href, options),
      replace: (href: string, options?: { scroll?: boolean }) => navigate(href, { ...options, replace: true }),
    }),
    [navigate],
  );
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/** In-app link. Internal paths become `#/path`; phone, mail, and web links pass through. */
export function Link({
  href,
  scroll = true,
  onClick,
  children,
  ...rest
}: Omit<ComponentProps<"a">, "href"> & { href: string; scroll?: boolean }) {
  const { navigate } = useRouterContext();

  if (isExternal(href)) {
    return (
      <a href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={`#${href}`}
      onClick={(e) => {
        onClick?.(e);
        // Let ctrl/cmd-click open a new tab as usual.
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href, { scroll });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Sends the visitor elsewhere as soon as it renders (used by the access guards). */
export function Redirect({ to }: { to: string }) {
  const { navigate } = useRouterContext();
  useEffect(() => navigate(to, { replace: true }), [navigate, to]);
  return null;
}

/** Sets the browser tab title for the current page. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
