import React from 'react';
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Scan,
  Database,
  Lock,
  Sparkles,
  Layers,
  HeartPulse,
  Apple,
  Sparkle
} from 'lucide-react';

export default function AboutView({ onNavigateTab }) {
  return (
    <div className="about-view-container max-w-5xl mx-auto">
      {/* Hero */}
      <div className="about-hero glass-card text-center p-8 mb-6 relative overflow-hidden">
        <div className="brand-icon-box mx-auto mb-3">
          <ShieldCheck size={36} className="text-cyan animate-pulse-glow" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
          ShopSafe – Product Management & Expiry Alert System
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An intelligent, offline-first expiry monitoring suite engineered to prevent food waste, prevent expired medicine consumption, and streamline shelf management.
        </p>
      </div>

      {/* Workflow Architecture */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-cyan" /> Core Application Workflow
        </h2>
        <div className="workflow-steps-grid">
          <div className="workflow-step">
            <div className="step-num">1</div>
            <h4 className="step-title">Add / Scan Product</h4>
            <p className="step-desc">
              Scan retail UPC/EAN barcodes with your camera or input manually.
            </p>
          </div>
          <div className="workflow-step">
            <div className="step-num">2</div>
            <h4 className="step-title">Enter Details</h4>
            <p className="step-desc">
              Set name, category, manufacturing date, and expiry date.
            </p>
          </div>
          <div className="workflow-step">
            <div className="step-num">3</div>
            <h4 className="step-title">Local Save</h4>
            <p className="step-desc">
              Persisted instantly into browser LocalStorage with zero cloud latency.
            </p>
          </div>
          <div className="workflow-step">
            <div className="step-num">4</div>
            <h4 className="step-title">Live Expiry Engine</h4>
            <p className="step-desc">
              Continuous date difference calculation categorizes products dynamically.
            </p>
          </div>
        </div>
      </div>

      {/* Expiry Status Categories Guide */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Layers size={18} className="text-cyan" /> Expiry Status Classification
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="status-explain-card card-explain-safe">
            <div className="flex items-center gap-2 mb-2">
              <span className="dot dot-green"></span>
              <h3 className="font-bold text-emerald">Safe / Valid</h3>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Product has <strong>more than 7 days</strong> until its designated expiry date.
            </p>
            <span className="text-3xs text-muted block">Status: Optimal quality & safety</span>
          </div>

          <div className="status-explain-card card-explain-amber">
            <div className="flex items-center gap-2 mb-2">
              <span className="dot dot-amber"></span>
              <h3 className="font-bold text-amber">Expiring Soon</h3>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Product expires within <strong>0 to 7 days</strong>.
            </p>
            <span className="text-3xs text-muted block">Status: Urgent attention & front shelf rotation</span>
          </div>

          <div className="status-explain-card card-explain-red">
            <div className="flex items-center gap-2 mb-2">
              <span className="dot dot-red"></span>
              <h3 className="font-bold text-crimson">Critical / Expired</h3>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Expiry date is <strong>in the past (overdue)</strong>.
            </p>
            <span className="text-3xs text-muted block">Status: Dispose safely or discard</span>
          </div>
        </div>
      </div>

      {/* Product Categories & Safety Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Apple size={18} className="text-emerald" />
            <h3 className="text-base font-bold text-white">Groceries & Dairy Care</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li>• Store dairy products below 4°C (39°F) on middle or bottom refrigerator shelves.</li>
            <li>• Bread and bakery items without preservatives should be stored in breadboxes or frozen.</li>
            <li>• Check pre-washed greens for moisture buildup to extend freshness.</li>
          </ul>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <HeartPulse size={18} className="text-cyan" />
            <h3 className="text-base font-bold text-white">Medicines & Pharmaceuticals</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li>• Never consume expired prescription antibiotics or liquid suspensions.</li>
            <li>• Store medicine in a dry cabinet away from bathroom steam and direct heat.</li>
            <li>• Keep original batch numbers and barcodes for safety recall tracking.</li>
          </ul>
        </div>
      </div>

      {/* Privacy & Storage Guarantee */}
      <div className="glass-card p-5 flex items-center gap-4">
        <div className="icon-badge icon-badge-cyan shrink-0">
          <Lock size={22} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">100% Client-Side Local Storage</h4>
          <p className="text-xs text-slate-300">
            ShopSafe operates entirely inside your local browser storage (<code className="font-mono text-cyan">shopsafeUserProducts</code>). No data is sent to external servers or third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
