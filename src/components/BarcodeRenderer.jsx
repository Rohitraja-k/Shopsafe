import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';

export default function BarcodeRenderer({
  value,
  format = 'CODE128',
  width = 1.5,
  height = 40,
  displayValue = true,
  lineColor = '#94a3b8',
  fontSize = 10
}) {
  const svgRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    if (!svgRef.current || !value) return;

    const renderBarcode = (fmt) => {
      JsBarcode(svgRef.current, String(value), {
        format: fmt,
        lineColor: lineColor,
        background: 'transparent',
        width: Math.max(1, width),
        height: height,
        displayValue: displayValue,
        fontSize: fontSize,
        fontOptions: '',
        font: 'monospace',
        textMargin: 3,
        margin: 4,
        marginTop: 4,
        marginBottom: 4,
        marginLeft: 8,
        marginRight: 8,
        valid: () => {}
      });
    };

    try {
      renderBarcode(format);
    } catch {
      try {
        renderBarcode('CODE128');
      } catch {
        setError(true);
      }
    }
  }, [value, format, width, height, displayValue, lineColor, fontSize]);

  if (!value) {
    return <span className="text-muted" style={{ fontSize: '0.72rem' }}>No Barcode</span>;
  }

  if (error) {
    return (
      <div className="barcode-error">
        <span className="font-mono" style={{ fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.05em' }}>
          {String(value)}
        </span>
      </div>
    );
  }

  return (
    <div className="barcode-container">
      <svg ref={svgRef} style={{ display: 'block', maxWidth: '100%' }} />
    </div>
  );
}
