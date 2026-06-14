import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Terminal } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <Helmet>
        <title>404 — Page not found · Pintu Kumar</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="max-w-md w-full">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dot terminal-dot-red" />
            <div className="terminal-dot terminal-dot-yellow" />
            <div className="terminal-dot terminal-dot-green" />
            <span className="text-xs text-muted-foreground font-mono ml-2">~/error</span>
          </div>
          <div className="p-6 font-mono text-sm space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-terminal-green">$</span>
              <span className="text-foreground break-all">cd {location.pathname}</span>
            </div>
            <div className="text-destructive pl-4">
              bash: cd: {location.pathname}: No such file or directory
            </div>
            <div className="flex items-start gap-2 pt-3">
              <span className="text-terminal-green">$</span>
              <span className="text-foreground">echo "404"</span>
            </div>
            <div className="text-5xl font-bold gradient-text pl-4 leading-none">404</div>
            <div className="pl-4 text-muted-foreground text-xs">page not found</div>
            <div className="pt-4 border-t border-border/60">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs text-primary hover:underline underline-offset-4"
              >
                <ArrowLeft size={14} /> cd ~/home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
