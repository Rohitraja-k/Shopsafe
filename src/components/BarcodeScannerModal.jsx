import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Zap, X, CheckCircle, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { playSound } from '../services/sound';

const QUICK_PRESETS = [
  { name: 'Organic Milk 1L', code: '8901234567890', cat: 'Groceries' },
  { name: 'Greek Yogurt 500g', code: '8901122334455', cat: 'Groceries' },
  { name: 'Whole Wheat Bread', code: '8909876543210', cat: 'Packaged Food' },
  { name: 'Baby Formula 400g', code: '8904433221100', cat: 'Medicines' },
  { name: 'Vitamin C 1000mg', code: '8905544332211', cat: 'Medicines' },
  { name: 'Hyaluronic Face Serum', code: '8906655443322', cat: 'Cosmetics' },
  { name: 'Dishwashing Liquid', code: '8908877665544', cat: 'Household' }
];

export default function BarcodeScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'simulator'
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scanAnimation, setScanAnimation] = useState(false);
  const scannerRef = useRef(null);
  const scannerContainerId = 'html5-qr-reader-container';

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (scannerRef.current) {
        await stopCamera();
      }

      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 180 },
        aspectRatio: 1.333
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          handleSuccessfulScan(decodedText);
        },
        () => {
          // Ignore intermediate frame scan failures
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.warn('Camera scan initialization failed:', err);
      setCameraError('Camera access denied or no camera device found. You can use the Quick Simulator or Manual entry.');
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.warn('Error stopping camera:', err);
      }
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  const handleSuccessfulScan = (code, meta = null) => {
    playSound('scan');
    setScanAnimation(true);
    setTimeout(() => {
      setScanAnimation(false);
      onScanSuccess(code, meta);
      onClose();
    }, 400);
  };

  const handleManualSimulate = () => {
    if (!manualInput.trim()) return;
    handleSuccessfulScan(manualInput.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card scanner-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="icon-badge icon-badge-cyan">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="modal-title">Barcode & QR Code Scanner</h3>
              <p className="modal-subtitle">Scan live with camera or pick from smart simulator presets</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close scanner">
            <X size={20} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="scanner-tabs">
          <button
            className={`scanner-tab ${activeTab === 'camera' ? 'active' : ''}`}
            onClick={() => setActiveTab('camera')}
          >
            <Camera size={16} />
            Live Camera Stream
          </button>
          <button
            className={`scanner-tab ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <Zap size={16} />
            Smart Barcode Simulator
          </button>
        </div>

        <div className="scanner-body">
          {activeTab === 'camera' ? (
            <div className="camera-view-box">
              <div id={scannerContainerId} className="scanner-viewport"></div>

              {/* Scanning visual overlay & laser */}
              <div className="scanner-laser-box">
                <div className="laser-line"></div>
                <div className="target-corners"></div>
              </div>

              {cameraError && (
                <div className="camera-error-banner">
                  <AlertCircle size={18} className="text-crimson" />
                  <div>
                    <p className="text-sm font-semibold">{cameraError}</p>
                    <button
                      className="btn btn-secondary btn-sm mt-2"
                      onClick={() => setActiveTab('simulator')}
                    >
                      Switch to Simulator Presets
                    </button>
                  </div>
                </div>
              )}
              <p className="scanner-hint">
                Position product barcode or QR code steadily inside the viewfinder
              </p>
            </div>
          ) : (
            <div className="simulator-view-box">
              <div className="sim-scan-header">
                <Sparkles size={16} className="text-cyan" />
                <span className="text-sm font-semibold text-white">Instant Product Barcode Presets</span>
              </div>
              <p className="text-xs text-muted mb-3">
                Click any standard retail product to simulate an instant optical laser scan:
              </p>

              <div className="preset-grid">
                {QUICK_PRESETS.map((preset) => (
                  <button
                    key={preset.code}
                    className="preset-chip"
                    onClick={() => handleSuccessfulScan(preset.code, preset)}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="preset-name">{preset.name}</span>
                      <span className="preset-category">{preset.cat}</span>
                    </div>
                    <div className="preset-code font-mono text-xs">{preset.code}</div>
                  </button>
                ))}
              </div>

              <div className="divider-or">
                <span>OR ENTER CODE DIRECTLY</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 8901234567890"
                  className="form-input font-mono text-sm"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSimulate()}
                />
                <button
                  className="btn btn-primary whitespace-nowrap"
                  onClick={handleManualSimulate}
                  disabled={!manualInput.trim()}
                >
                  <Zap size={16} /> Simulate Scan
                </button>
              </div>
            </div>
          )}
        </div>

        {scanAnimation && (
          <div className="scan-success-overlay">
            <CheckCircle size={48} className="text-emerald animate-bounce" />
            <span className="text-lg font-bold text-white mt-2">Barcode Captured!</span>
          </div>
        )}
      </div>
    </div>
  );
}
