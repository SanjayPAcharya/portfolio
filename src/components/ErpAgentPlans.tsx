import React, { useEffect, useState } from "react";
import { ChevronDown, RefreshCw, Loader2, X, Pencil } from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────
export interface PlanRow {
  code: string;
  site: string;
  plan: string | null;
  amount: number | null;
  period: string | null;
  paid_until: string | null;
  remind_days: number | null;
  reminders: "on" | "off" | null;
  stage: "active" | "due_soon" | "ended" | null;
  days_left: number | null;
}

interface PaymentDetails {
  upi_id: string;
  payee: string;
  contact: string;
}

interface PlansResponse {
  plans: PlanRow[];
  payment: PaymentDetails;
  payment_details_set: boolean;
}

// ── Date / money helpers ─────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1] ?? "?"} ${y}`;
}

function lastDayOfMonth(y: number, m0: number): number {
  return new Date(y, m0 + 1, 0).getDate();
}

function toISO(y: number, m0: number, d: number): string {
  return `${y}-${String(m0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayISO(): string {
  const n = new Date();
  return toISO(n.getFullYear(), n.getMonth(), n.getDate());
}

/** 30th of the month after `fromISO` (or after today if omitted), clamped to the
 *  month's last day and to today at the earliest. */
function defaultBilling(fromISO?: string | null): string {
  let y: number;
  let m: number;
  if (fromISO && fromISO.split("-").length === 3) {
    const [yy, mm] = fromISO.split("-").map(Number);
    y = yy;
    m = mm - 1;
  } else {
    const n = new Date();
    y = n.getFullYear();
    m = n.getMonth();
  }
  m += 1;
  if (m > 11) {
    m = 0;
    y += 1;
  }
  const d = Math.min(30, lastDayOfMonth(y, m));
  const iso = toISO(y, m, d);
  const t = todayISO();
  return iso < t ? t : iso;
}

const rupees = (n: number | null | undefined): string =>
  n == null ? "—" : `₹${Number(n).toLocaleString("en-IN")}`;

function planSummary(row: PlanRow): string {
  if (!row.plan) return "No plan";
  const amt = row.amount != null ? `, ${rupees(row.amount)}` : "";
  const per = row.period ? ` a ${row.period}` : "";
  return `${row.plan}${amt}${per}`;
}

interface Badge {
  label: string;
  cls: string;
}

function badgeFor(row: PlanRow): Badge {
  const grey = "bg-white/5 text-slate-400 border-white/10";
  const neutral = "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
  const amber = "bg-amber-500/10 text-amber-300 border-amber-500/30";
  const red = "bg-red-500/10 text-red-300 border-red-500/30";
  if (row.reminders === "off") return { label: "Reminders off", cls: grey };
  if (!row.plan) return { label: "No plan", cls: grey };
  const days = row.days_left ?? 0;
  if (row.stage === "active") return { label: `Active, ${days} days left`, cls: neutral };
  if (row.stage === "due_soon")
    return { label: days > 0 ? `Renewal due in ${days} days` : "Renewal due today", cls: amber };
  if (row.stage === "ended") return { label: `Ended ${Math.abs(days)} days ago`, cls: red };
  return { label: "No plan", cls: grey };
}

// ── Network: dedicated call with a 50s client timeout ────────────────────────
async function callLambda<T>(endpoint: string, passcode: string, body: Record<string, unknown>): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 50_000);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-custom-auth": passcode },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      const msg =
        res.status === 403
          ? "Authentication failed"
          : data?.message || `Request failed (${res.status}).`;
      throw new Error(msg);
    }
    return data as T;
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new Error(
        "The server didn't answer in time. Load the plans again before retrying: the change may have gone through."
      );
    }
    if (e instanceof TypeError) {
      // Network / CORS failure (e.g. a localhost test against the production-only origin).
      throw new Error("Could not reach the server.");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

const PERIODS = ["month", "quarter", "half-year", "year"] as const;

// ── Small UI atoms ───────────────────────────────────────────────────────────
const fieldCls =
  "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-400/40 focus:bg-white/[0.07] transition-colors";
const labelCls = "block text-[10px] font-medium text-slate-400 tracking-[0.12em] uppercase mb-1.5";
const btnBase =
  "inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
type PanelType = "billing" | "plan" | "reminders" | "end" | "payment" | "create";

const ErpAgentPlans: React.FC<{
  endpoint: string;
  passcode: string;
  serverOnline: boolean;
}> = ({ endpoint, passcode, serverOnline }) => {
  const [open, setOpen] = useState(true);
  const [plans, setPlans] = useState<PlanRow[] | null>(null);
  const [payment, setPayment] = useState<PaymentDetails>({ upi_id: "", payee: "", contact: "" });
  const [paymentSet, setPaymentSet] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null); // key of the in-flight write
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [openPanel, setOpenPanel] = useState<string | null>(null); // `${code}:${type}`
  const [form, setForm] = useState<Record<string, any>>({});

  const call = <T,>(body: Record<string, unknown>) => callLambda<T>(endpoint, passcode, body);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await call<PlansResponse>({ action: "plans" });
      const rows = data.plans ?? [];
      setPlans(rows);
      setPayment(data.payment ?? { upi_id: "", payee: "", contact: "" });
      setPaymentSet(Boolean(data.payment_details_set));
      // Keep the current selection if it still exists, else select the first customer.
      setSelectedCode((prev) => (rows.some((r) => r.code === prev) ? prev : rows[0]?.code ?? ""));
    } catch (e: any) {
      setError(e.message || "Could not load plans.");
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && serverOnline && plans === null && !loading) load();
  };

  // Load plans once the section is open and the server is confirmed online.
  useEffect(() => {
    if (open && serverOnline && plans === null && !loading) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, serverOnline]);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  };

  const upsertRow = (row: PlanRow) =>
    setPlans((prev) => (prev ? prev.map((p) => (p.code === row.code ? row : p)) : prev));

  // Generic write: confirm → call → apply → toast. Never fires without confirm.
  const runWrite = async (
    key: string,
    body: Record<string, unknown>,
    confirmMsg: string,
    apply: (data: any) => void
  ) => {
    if (!window.confirm(confirmMsg)) return;
    setBusy(key);
    setError("");
    try {
      const data = await call<any>(body);
      apply(data);
      setOpenPanel(null);
      flash("Saved");
    } catch (e: any) {
      setError(e.message || "That didn't work.");
    } finally {
      setBusy(null);
    }
  };

  const openForm = (code: string, type: PanelType, init: Record<string, any>) => {
    setOpenPanel(`${code}:${type}`);
    setForm(init);
    setError("");
  };

  const isOpen = (code: string, type: PanelType) => openPanel === `${code}:${type}`;
  const anyBusy = busy !== null;

  const selectedRow = plans?.find((p) => p.code === selectedCode) ?? null;

  const Spinner = (
    <div className="flex items-center gap-2 text-xs text-violet-300 mt-3">
      <Loader2 size={13} className="animate-spin" />
      <span>Talking to the server, up to 40 seconds…</span>
    </div>
  );

  const header = (
    <button
      onClick={toggleOpen}
      className="w-full flex items-center justify-between gap-2 text-left border-t border-white/5 pt-4 mt-5 xl:border-t-0 xl:pt-0 xl:mt-0"
      aria-expanded={open}
    >
      <span className="text-sm font-semibold text-white">Customer plans</span>
      <ChevronDown
        size={16}
        className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
      />
    </button>
  );

  if (!open) return header;

  return (
    <>
      {header}

      <div className="mt-4 space-y-4">
        {!serverOnline ? (
          <p className="text-xs text-amber-300/80 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-3">
            Start the server to manage plans.
          </p>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500">
                {plans ? `${plans.length} customer${plans.length === 1 ? "" : "s"}` : "…"}
              </span>
              <button
                onClick={load}
                disabled={loading || anyBusy}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {toast && (
              <p className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
                {toast}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-300 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {loading && plans === null && Spinner}

            {plans && plans.length === 0 && !loading && (
              <p className="text-xs text-slate-500">No customers found.</p>
            )}

            {/* Customer selector */}
            {plans && plans.length > 0 && (
              <div className="max-w-sm">
                <label htmlFor="erp-customer" className={labelCls}>
                  Customer
                </label>
                <select
                  id="erp-customer"
                  className={`${fieldCls} appearance-none`}
                  value={selectedCode}
                  onChange={(e) => {
                    setSelectedCode(e.target.value);
                    setOpenPanel(null);
                    setError("");
                  }}
                >
                  {plans.map((p) => (
                    <option key={p.code} value={p.code} className="bg-[#0f0f1a]">
                      {p.code} — {badgeFor(p).label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selected customer detail */}
            {selectedRow &&
              (() => {
                const row = selectedRow;
                const badge = badgeFor(row);
                const hasPlan = Boolean(row.plan);
                return (
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{row.code}</p>
                        <p className="text-[11px] text-slate-500 truncate">{row.site}</p>
                        <p className="text-xs text-slate-400 mt-1">{planSummary(row)}</p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full border flex-shrink-0 ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {hasPlan && (
                      <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                        <p>Next billing: {fmtDate(row.paid_until)}</p>
                        {row.reminders === "on" && row.remind_days != null && (
                          <p>Reminders from {row.remind_days} days before</p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {hasPlan ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          disabled={anyBusy}
                          onClick={() =>
                            openForm(row.code, "billing", {
                              paid_until: defaultBilling(row.paid_until),
                              remind_days: row.remind_days ?? 7,
                              note: "",
                            })
                          }
                          className={`${btnBase} bg-violet-500/15 text-violet-200 border border-violet-400/30 hover:bg-violet-500/25 flex-1 min-w-[140px]`}
                        >
                          Next billing date
                        </button>
                        <button
                          disabled={anyBusy}
                          onClick={() => openForm(row.code, "reminders", { note: "" })}
                          className={`${btnBase} bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10`}
                        >
                          Reminders
                        </button>
                        <button
                          disabled={anyBusy}
                          onClick={() =>
                            openForm(row.code, "plan", {
                              plan: row.plan ?? "Subscription",
                              amount: row.amount ?? "",
                              period: row.period ?? "month",
                              paid_until: row.paid_until ?? defaultBilling(),
                              remind_days: row.remind_days ?? 3,
                              note: "",
                            })
                          }
                          className={`${btnBase} bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10`}
                        >
                          Edit plan
                        </button>
                        <button
                          disabled={anyBusy}
                          onClick={() =>
                            setOpenPanel(isOpen(row.code, "end") ? null : `${row.code}:end`)
                          }
                          className={`${btnBase} px-3 text-slate-500 hover:text-slate-300`}
                        >
                          More
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <button
                          disabled={anyBusy}
                          onClick={() =>
                            openForm(row.code, "create", {
                              plan: "Subscription",
                              amount: "",
                              period: "month",
                              paid_until: defaultBilling(),
                              remind_days: 3,
                              note: "",
                            })
                          }
                          className={`${btnBase} bg-violet-500/15 text-violet-200 border border-violet-400/30 hover:bg-violet-500/25 w-full`}
                        >
                          Create plan
                        </button>
                      </div>
                    )}

                    {/* ── Panels ── */}
                    {isOpen(row.code, "end") && (
                      <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/[0.03] p-3">
                        <p className="text-xs text-slate-400 mb-3">
                          Ending the plan stops all reminders. The customer's site and data stay.
                        </p>
                        <button
                          disabled={anyBusy}
                          onClick={() =>
                            runWrite(
                              `${row.code}:end`,
                              { action: "end_plan", code: row.code, note: "" },
                              `End ${row.code}'s plan? They get no more reminders. Their site and data stay.`,
                              (data) => data?.plan && upsertRow(data.plan)
                            )
                          }
                          className={`${btnBase} bg-red-500/15 text-red-200 border border-red-400/30 hover:bg-red-500/25 w-full`}
                        >
                          End plan
                        </button>
                      </div>
                    )}

                    {isOpen(row.code, "reminders") && (
                      <PanelShell title="Reminders" onClose={() => setOpenPanel(null)}>
                        <p className="text-xs text-slate-400 -mt-1 mb-1">
                          Currently <strong className="text-slate-200">{row.reminders}</strong>.
                          Turning them off keeps the plan but hides the customer's reminder card and
                          pop-up.
                        </p>
                        <Field label="Note (optional)">
                          <input
                            className={fieldCls}
                            value={form.note ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                            placeholder="e.g. Promised to pay Monday"
                          />
                        </Field>
                        <div className="flex gap-2 pt-1">
                          {row.reminders === "on" ? (
                            <button
                              disabled={anyBusy}
                              onClick={() =>
                                runWrite(
                                  `${row.code}:reminders`,
                                  { action: "reminders", code: row.code, on: false, note: form.note || undefined },
                                  `Stop all reminders for ${row.code}? Their plan is kept.`,
                                  (data) => data?.plan && upsertRow(data.plan)
                                )
                              }
                              className={`${btnBase} bg-amber-500/15 text-amber-200 border border-amber-400/30 hover:bg-amber-500/25 flex-1`}
                            >
                              Turn reminders off
                            </button>
                          ) : (
                            <button
                              disabled={anyBusy}
                              onClick={() =>
                                runWrite(
                                  `${row.code}:reminders`,
                                  { action: "reminders", code: row.code, on: true, note: form.note || undefined },
                                  `Turn reminders back on for ${row.code}?`,
                                  (data) => data?.plan && upsertRow(data.plan)
                                )
                              }
                              className={`${btnBase} bg-emerald-500/15 text-emerald-200 border border-emerald-400/30 hover:bg-emerald-500/25 flex-1`}
                            >
                              Turn reminders on
                            </button>
                          )}
                        </div>
                        {busy === `${row.code}:reminders` && Spinner}
                      </PanelShell>
                    )}

                    {isOpen(row.code, "billing") && (
                      <PanelShell title="Next billing date" onClose={() => setOpenPanel(null)}>
                        <Field label="Next billing date">
                          <input
                            type="date"
                            min={todayISO()}
                            className={fieldCls}
                            value={form.paid_until ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, paid_until: e.target.value }))}
                          />
                        </Field>
                        <Field label="Remind days before (0–60)">
                          <input
                            type="number"
                            min={0}
                            max={60}
                            className={fieldCls}
                            value={form.remind_days ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, remind_days: e.target.value }))}
                          />
                        </Field>
                        <Field label="Note (optional)">
                          <input
                            className={fieldCls}
                            value={form.note ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                            placeholder="e.g. Paid cash"
                          />
                        </Field>
                        <button
                          disabled={anyBusy || !form.paid_until}
                          onClick={() =>
                            runWrite(
                              `${row.code}:billing`,
                              {
                                action: "set_billing",
                                code: row.code,
                                paid_until: form.paid_until,
                                remind_days:
                                  form.remind_days === "" || form.remind_days == null
                                    ? undefined
                                    : Number(form.remind_days),
                                note: form.note || undefined,
                              },
                              `Set ${row.code}'s next billing date to ${fmtDate(form.paid_until)}?`,
                              (data) => data?.plan && upsertRow(data.plan)
                            )
                          }
                          className={`${btnBase} bg-violet-500/20 text-violet-100 border border-violet-400/40 hover:bg-violet-500/30 w-full`}
                        >
                          Save
                        </button>
                        {busy === `${row.code}:billing` && Spinner}
                      </PanelShell>
                    )}

                    {(isOpen(row.code, "plan") || isOpen(row.code, "create")) && (
                      <PlanForm
                        code={row.code}
                        creating={isOpen(row.code, "create")}
                        form={form}
                        setForm={setForm}
                        busy={busy}
                        disabled={anyBusy}
                        onClose={() => setOpenPanel(null)}
                        onSave={() => {
                          const creating = isOpen(row.code, "create");
                          const body: Record<string, unknown> = {
                            action: "save_plan",
                            code: row.code,
                            paid_until: form.paid_until,
                          };
                          const amt = form.amount === "" || form.amount == null ? null : Number(form.amount);
                          if (creating) {
                            body.plan = form.plan || "Subscription";
                            if (amt != null) body.amount = amt;
                            body.period = form.period || "month";
                            body.remind_days = Number(form.remind_days);
                          } else {
                            if (form.plan !== row.plan) body.plan = form.plan;
                            if (amt !== row.amount && amt != null) body.amount = amt;
                            if (form.period !== row.period) body.period = form.period;
                            if (Number(form.remind_days) !== row.remind_days)
                              body.remind_days = Number(form.remind_days);
                          }
                          if (form.note) body.note = form.note;

                          const amountChanged = !creating && amt != null && amt !== row.amount;
                          const confirmMsg = creating
                            ? `Create a plan for ${row.code}: ${rupees(amt)} a ${form.period}, first billing on ${fmtDate(form.paid_until)}?`
                            : amountChanged
                            ? `Customers will be asked to pay ${rupees(amt)} instead of ${rupees(row.amount)}. Save?`
                            : `Save changes to ${row.code}'s plan?`;

                          runWrite(
                            `${row.code}:plan`,
                            body,
                            confirmMsg,
                            (data) => data?.plan && upsertRow(data.plan)
                          );
                        }}
                      />
                    )}
                  </div>
                );
              })()}

            {/* Payment details */}
            {plans && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 mt-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white">Payment details</span>
                  <button
                    disabled={anyBusy}
                    onClick={() =>
                      openForm("__payment__", "payment", {
                        upi_id: payment.upi_id,
                        payee: payment.payee,
                        contact: payment.contact,
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
                  >
                    <Pencil size={11} /> Edit
                  </button>
                </div>
                {!paymentSet && (
                  <p className="text-xs text-amber-300/80 mt-2">Customers see no UPI details yet.</p>
                )}
                <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
                  <p>UPI ID: {payment.upi_id || "—"}</p>
                  <p>Payee: {payment.payee || "—"}</p>
                  <p>Contact: {payment.contact || "—"}</p>
                </div>

                {openPanel === "__payment__:payment" && (
                  <PanelShell title="Edit payment details" onClose={() => setOpenPanel(null)}>
                    <Field label="UPI ID (name@bank)">
                      <input
                        className={fieldCls}
                        value={form.upi_id ?? ""}
                        onChange={(e) => setForm((f) => ({ ...f, upi_id: e.target.value }))}
                        placeholder="name@bank"
                      />
                    </Field>
                    <Field label="Payee">
                      <input
                        className={fieldCls}
                        value={form.payee ?? ""}
                        onChange={(e) => setForm((f) => ({ ...f, payee: e.target.value }))}
                      />
                    </Field>
                    <Field label="Contact">
                      <input
                        className={fieldCls}
                        value={form.contact ?? ""}
                        onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                      />
                    </Field>
                    <button
                      disabled={anyBusy}
                      onClick={() => {
                        const body: Record<string, unknown> = { action: "payment_details" };
                        if (form.upi_id !== payment.upi_id) body.upi_id = form.upi_id;
                        if (form.payee !== payment.payee) body.payee = form.payee;
                        if (form.contact !== payment.contact) body.contact = form.contact;
                        runWrite(
                          "__payment__:payment",
                          body,
                          `Customers will pay to ${form.upi_id}. Save?`,
                          (data) => {
                            if (data?.payment) setPayment(data.payment);
                            setPaymentSet(Boolean(data?.payment_details_set));
                          }
                        );
                      }}
                      className={`${btnBase} bg-violet-500/20 text-violet-100 border border-violet-400/40 hover:bg-violet-500/30 w-full`}
                    >
                      Save
                    </button>
                    {busy === "__payment__:payment" && Spinner}
                  </PanelShell>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

// ── Sub-components ───────────────────────────────────────────────────────────
function PanelShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">{title}</span>
        <button onClick={onClose} className="text-slate-500 hover:text-white" aria-label="Close">
          <X size={14} />
        </button>
      </div>
      {children}
    </div>
  );
}

function PlanForm({
  code,
  creating,
  form,
  setForm,
  busy,
  disabled,
  onClose,
  onSave,
}: {
  code: string;
  creating: boolean;
  form: Record<string, any>;
  setForm: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  busy: string | null;
  disabled: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const saveDisabled = disabled || !form.paid_until || (creating && (form.amount === "" || form.amount == null));
  return (
    <PanelShell title={creating ? "Create plan" : "Edit plan"} onClose={onClose}>
      <Field label="Plan name">
        <input
          className={fieldCls}
          value={form.plan ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
          placeholder="Subscription"
        />
      </Field>
      <Field label={`Amount in ₹${creating ? " (required)" : ""}`}>
        <input
          type="number"
          min={1}
          className={fieldCls}
          value={form.amount ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          placeholder="6100"
        />
      </Field>
      <Field label="Period">
        <select
          className={fieldCls}
          value={form.period ?? "month"}
          onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
        >
          {PERIODS.map((p) => (
            <option key={p} value={p} className="bg-[#0f0f1a]">
              {p}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Next billing date">
        <input
          type="date"
          min={todayISO()}
          className={fieldCls}
          value={form.paid_until ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, paid_until: e.target.value }))}
        />
      </Field>
      <Field label="Remind days before (0–60)">
        <input
          type="number"
          min={0}
          max={60}
          className={fieldCls}
          value={form.remind_days ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, remind_days: e.target.value }))}
        />
      </Field>
      <Field label="Note (optional)">
        <input
          className={fieldCls}
          value={form.note ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
        />
      </Field>
      <button
        disabled={saveDisabled}
        onClick={onSave}
        className={`${btnBase} bg-violet-500/20 text-violet-100 border border-violet-400/40 hover:bg-violet-500/30 w-full`}
      >
        Save
      </button>
      {busy === `${code}:plan` && (
        <div className="flex items-center gap-2 text-xs text-violet-300">
          <Loader2 size={13} className="animate-spin" />
          <span>Talking to the server, up to 40 seconds…</span>
        </div>
      )}
    </PanelShell>
  );
}

export default ErpAgentPlans;
