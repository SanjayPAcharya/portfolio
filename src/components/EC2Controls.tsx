import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Server, Power, RefreshCw, Globe } from "lucide-react";
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

type UiState = "checking" | "online" | "offline" | "error" | "auth" | "unconfigured";

interface Machine {
  name: string;
  description: string;
  tags: string[];
  secretKey?: string;
  // Action-style control: one endpoint, payload { action: 'start' | 'stop' | 'status' }
  controlEndpoint?: string;
  // Legacy control: separate start/stop endpoints, status via start endpoint + { isUP: true }
  startEndpoint?: string;
  stopEndpoint?: string;
}

const machines: Machine[] = [
  {
    name: "Live SSE Dashboard",
    description:
      "Real-time dashboard demo — Node.js backend streaming live data to React over Server-Sent Events.",
    tags: ["SSE", "Node.js", "AWS EC2"],
    secretKey: import.meta.env.VITE_EC2_SECRET_KEY,
    startEndpoint: import.meta.env.VITE_EC2_START_ENDPOINT,
    stopEndpoint: import.meta.env.VITE_EC2_STOP_ENDPOINT,
  },
  {
    name: "PMAGENT",
    description:
      "AI project-management agent — autonomous planning, ticketing and progress tracking.",
    tags: ["AI Agent", "AWS EC2", "Lambda"],
    secretKey: import.meta.env.VITE_EC2_SECRET_KEY_2,
    controlEndpoint: import.meta.env.VITE_EC2_CONTROL_ENDPOINT_2,
  },
];

const statusPill: Record<UiState, { classes: string; label: string }> = {
  online: { classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", label: "● Live" },
  offline: { classes: "bg-white/5 text-slate-500 border-white/10", label: "○ Offline" },
  checking: { classes: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse", label: "◌ Checking" },
  auth: { classes: "bg-red-500/10 text-red-400 border-red-500/30", label: "⛔ Auth failed" },
  error: { classes: "bg-red-500/10 text-red-400 border-red-500/30", label: "⚠ Error" },
  unconfigured: { classes: "bg-white/5 text-slate-600 border-white/10", label: "— Not configured" },
};

const EC2MachineCard: React.FC<{ machine: Machine; index: number }> = ({ machine, index }) => {
  const [statusDetail, setStatusDetail] = useState<string>("Checking server status…");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [uiState, setUiState] = useState<UiState>("checking");

  const { post: postCheck, loading: loadingCheck } = useApi<EC2Response>();
  const { post: postStart, loading: loadingStart } = useApi<EC2Response>();
  const { post: postStop, loading: loadingStop } = useApi<EC2Response>();

  const loading = loadingStart || loadingStop || loadingCheck;
  const configured = Boolean(
    machine.controlEndpoint || (machine.startEndpoint && machine.stopEndpoint)
  );
  const authHeaders = { "x-custom-auth": machine.secretKey ?? "" };

  const mountedRef = useRef<boolean>(false);
  const didCheckRef = useRef<boolean>(false);

  const applyState = (data: EC2Response) => {
    const running = data.state === "running";
    setIsRunning(running);
    if (running) {
      setStatusDetail(data.public_ip ? `Running • ${data.public_ip}` : "Running");
      setUiState("online");
    } else {
      setStatusDetail("Instance is stopped");
      setUiState("offline");
    }
  };

  const checkStatus = async () => {
    if (!configured) {
      setStatusDetail("Endpoint not configured for this environment");
      setUiState("unconfigured");
      return;
    }
    setStatusDetail("Checking server status…");
    setUiState("checking");
    try {
      const data = machine.controlEndpoint
        ? await postCheck(machine.controlEndpoint, { action: "status" }, authHeaders)
        : await postCheck(machine.startEndpoint!, { isUP: true }, authHeaders);
      if (!mountedRef.current) return;
      applyState(data);
    } catch (e: any) {
      if (!mountedRef.current) return;
      setIsRunning(false);
      const isAuth = e?.message?.includes?.("Forbidden");
      setStatusDetail(isAuth ? "Authentication failed" : "Could not reach control endpoint");
      setUiState(isAuth ? "auth" : "error");
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    if (didCheckRef.current) return;
    didCheckRef.current = true;

    checkStatus();

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = async () => {
    if (isRunning) return;
    setStatusDetail("Starting instance…");
    setUiState("checking");
    try {
      const data = machine.controlEndpoint
        ? await postStart(machine.controlEndpoint, { action: "start" }, authHeaders)
        : await postStart(machine.startEndpoint!, {}, authHeaders);
      if (!mountedRef.current) return;
      applyState({ ...data, state: data.state || "running" });
    } catch {
      if (!mountedRef.current) return;
      setIsRunning(false);
      setStatusDetail("Start failed — try again");
      setUiState("error");
    }
  };

  const handleStop = async () => {
    if (!isRunning) return;
    if (!confirm(`Stop ${machine.name}?`)) return;
    setStatusDetail("Stopping instance…");
    setUiState("checking");
    try {
      machine.controlEndpoint
        ? await postStop(machine.controlEndpoint, { action: "stop" }, authHeaders)
        : await postStop(machine.stopEndpoint!, {}, authHeaders);
      if (!mountedRef.current) return;
      setIsRunning(false);
      setStatusDetail("Instance is stopped");
      setUiState("offline");
    } catch {
      if (!mountedRef.current) return;
      setStatusDetail("Stop failed — try again");
      setUiState("error");
    }
  };

  const pill = statusPill[uiState];
  // Only allow an action once the actual state is known, and never repeat the current one
  const canStart = configured && !loading && uiState === "offline";
  const canStop = configured && !loading && uiState === "online";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl overflow-hidden gradient-border"
    >
      <div className="p-7">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
              <Server size={17} className="text-violet-300" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white leading-tight">
                {machine.name}
              </h2>
              <span className="text-[10px] font-medium text-violet-400/70 tracking-[0.2em] uppercase">
                EC2 Instance
              </span>
            </div>
          </div>
          <span
            className={`text-[9px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${pill.classes}`}
          >
            {pill.label}
          </span>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-5">{machine.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {machine.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Status detail */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-live="polite">
          <Globe size={12} className="flex-shrink-0" />
          <span>{statusDetail}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              canStart
                ? "text-white hover:opacity-90 hover:scale-105"
                : "text-slate-500 bg-white/5 border border-white/10 cursor-not-allowed"
            }`}
            style={
              canStart
                ? {
                    background: "linear-gradient(135deg, #10B981, #22D3EE)",
                    boxShadow: "0 0 24px rgba(16,185,129,0.35)",
                  }
                : {}
            }
          >
            <Power size={13} />
            {loadingStart ? "Starting…" : "Start"}
          </button>

          <button
            onClick={handleStop}
            disabled={!canStop}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              canStop
                ? "text-white bg-red-500/80 hover:bg-red-500 hover:scale-105 shadow-[0_0_24px_rgba(239,68,68,0.3)]"
                : "text-slate-500 bg-white/5 border border-white/10 cursor-not-allowed"
            }`}
          >
            <Power size={13} />
            {loadingStop ? "Stopping…" : "Stop"}
          </button>

          <button
            onClick={checkStatus}
            disabled={!configured || loading}
            title="Refresh status"
            aria-label={`Refresh ${machine.name} status`}
            className="ml-auto inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw size={13} className={loadingCheck ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const EC2Controls: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#08080F] overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-violet-700/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-cyan-700/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs font-medium text-violet-400/70 tracking-[0.25em] uppercase mb-3">
            — Infrastructure —
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text">
              Server Controls
            </h1>
            <p className="text-sm text-slate-500 tracking-wide">
              Start & stop project demo servers
            </p>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-violet-500/40 via-pink-500/20 to-transparent" />
        </motion.div>

        {/* Machine cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {machines.map((machine, i) => (
            <EC2MachineCard key={machine.name} machine={machine} index={i} />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-600">
          Please stop instances when you’re done — every idle hour counts. 🙂
        </p>
      </div>
    </div>
  );
};

export default EC2Controls;
