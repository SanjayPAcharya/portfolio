import { useEffect, useRef, useState, useMemo } from "react";
import { useApi } from "../hooks/useApi";

interface EC2Response {
  message: string;
  state: string;
  instance_id: string;
  public_ip?: string;
  client_url?: string;
  api_url?: string;
  note?: string;
  domains_updated?: string[];
  error?: string;
}

type UiState = "checking" | "online" | "offline" | "error" | "auth";

const EC2ControlInline = () => {
  const [status, setStatus] = useState<string>("Checking...");
  const [isRunning, setIsRunning] = useState(false);
  const [uiState, setUiState] = useState<UiState>("checking");

  const { post: postCheck, loading: loadingCheck } = useApi<EC2Response>();
  const { post: postStart, loading: loadingStart } = useApi<EC2Response>();
  const { post: postStop,  loading: loadingStop  } = useApi<EC2Response>();

  const loading = loadingStart || loadingStop || loadingCheck;

  // Guards for Strict Mode / unmount
  const mountedRef = useRef(false);
  const didCheckRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    if (didCheckRef.current) return;
    didCheckRef.current = true;

    (async () => {
      setStatus("Checking...");
      setUiState("checking");
      try {
        const data = await postCheck(
          import.meta.env.VITE_EC2_START_ENDPOINT,
          { isUP: true },
          { "x-custom-auth": import.meta.env.VITE_EC2_SECRET_KEY }
        );
        if (!mountedRef.current) return;

        const running = data.state === "running";
        setIsRunning(running);
        if (running) {
          setStatus(`Online • ${data.public_ip ?? "no-ip"}`);
          setUiState("online");
        } else {
          setStatus("Offline");
          setUiState("offline");
        }
      } catch (e: any) {
        if (!mountedRef.current) return;
        setIsRunning(false);
        const isAuth = e?.message?.includes?.("Forbidden");
        setStatus(isAuth ? "Auth failed" : "Check failed");
        setUiState(isAuth ? "auth" : "error");
      }
    })();

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = async () => {
    setStatus("Starting...");
    setUiState("checking");
    try {
      const data = await postStart(
        import.meta.env.VITE_EC2_START_ENDPOINT,
        {},
        { "x-custom-auth": import.meta.env.VITE_EC2_SECRET_KEY }
      );
      if (!mountedRef.current) return;
      setIsRunning(true);
      setStatus(`Online • ${data.public_ip ?? "no-ip"}`);
      setUiState("online");
    } catch {
      if (!mountedRef.current) return;
      setIsRunning(false);
      setStatus("Start failed");
      setUiState("error");
    }
  };

  const handleStop = async () => {
    if (!confirm("Stop server?")) return;
    setStatus("Stopping...");
    setUiState("checking");
    try {
      await postStop(
        import.meta.env.VITE_EC2_STOP_ENDPOINT,
        {},
        { "x-custom-auth": import.meta.env.VITE_EC2_SECRET_KEY }
      );
      if (!mountedRef.current) return;
      setIsRunning(false);
      setStatus("Offline");
      setUiState("offline");
    } catch {
      if (!mountedRef.current) return;
      setStatus("Stop failed");
      setUiState("error");
    }
  };

  // Banner styles/messages per state
  const banner = useMemo(() => {
    switch (uiState) {
      case "online":
        return {
          wrap: "bg-green-50 border-green-200",
          icon: "text-green-600",
          text: "text-green-800",
          msg: "Server is running. Please stop the live server when you’re done exploring. ✅",
          glyph: "🟢",
        };
      case "offline":
        return {
          wrap: "bg-amber-50 border-amber-200",
          icon: "text-amber-600",
          text: "text-amber-800",
          msg: "Server is offline. Start it to view live demos, and stop it after use. 🙂",
          glyph: "🟡",
        };
      case "checking":
        return {
          wrap: "bg-blue-50 border-blue-200",
          icon: "text-blue-600",
          text: "text-blue-800",
          msg: "Checking server status…",
          glyph: "🔎",
        };
      case "auth":
        return {
          wrap: "bg-red-50 border-red-200",
          icon: "text-red-600",
          text: "text-red-800",
          msg: "Authentication failed. Please refresh and try again.",
          glyph: "⛔",
        };
      default: // error
        return {
          wrap: "bg-red-50 border-red-200",
          icon: "text-red-600",
          text: "text-red-800",
          msg: "Something went wrong checking the server. Please try again.",
          glyph: "⚠️",
        };
    }
  }, [uiState]);

  return (
    <div
      className="
        grid gap-4 md:gap-6
        md:grid-cols-2
        items-stretch
      "
    >
      {/* Responsive banner */}
      <div className={`border rounded-lg shadow-sm px-4 py-3 flex items-start gap-3 ${banner.wrap}`}>
        <div className={`${banner.icon} text-lg leading-none`}>{banner.glyph}</div>
        <p className={`text-sm ${banner.text}`}>{banner.msg}</p>
      </div>

      {/* Responsive control pill */}
      <div
        className="
          w-full
          bg-white border border-gray-200 rounded-full shadow-sm
          px-3 py-2
          flex flex-wrap items-center justify-between gap-3
          md:justify-start md:gap-4
        "
      >
        <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-500" : uiState === "checking" ? "bg-blue-500" : "bg-gray-400"}`} />
        <span
          className="text-sm text-gray-700 min-w-[140px]"
          aria-live="polite"
          aria-atomic="true"
        >
          {status}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={isRunning ? handleStop : handleStart}
            disabled={loading}
            className={`px-3 py-1.5 text-xs font-medium text-white rounded-full transition
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            `}
          >
            {loading ? "•••" : isRunning ? "Stop" : "Start"}
          </button>

          {/* Secondary hint chip shows target URL when running */}
          {isRunning && (
            <span className="hidden sm:inline text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded-full px-2 py-1">
              Live
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EC2ControlInline;
