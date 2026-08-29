import { useState, useRef } from 'react';
import { ArrowDownToLine, Copy, Pencil, Plus, Printer, Search, Trash2 } from 'lucide-react';
import { type AnyDoc, type DocKind, type Branding, type Settings, DOC_CONFIG } from './types';
import { money, docTotal, exportPDF, exportPNG, uid, generateNumber, formatDate } from './lib';
import { DocumentTemplate } from './DocumentTemplate';
import { DocumentEditor } from './DocumentEditor';

type Props = {
  kind: DocKind;
  docs: AnyDoc[];
  setDocs: (docs: AnyDoc[]) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  branding: Branding;
};

export function DocumentWorkspace({ kind, docs, setDocs, settings, setSettings, branding }: Props) {
  const config = DOC_CONFIG[kind];
  const [selectedId, setSelectedId] = useState(docs[0]?.id ?? '');
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  const selected = docs.find((d) => d.id === selectedId) ?? docs[0];
  const visible = docs.filter((d) => `${d.number} ${d.customer}`.toLowerCase().includes(query.toLowerCase()));

  const handleCreate = () => {
    const prefix = kind === 'invoice' ? settings.numbering.invoicePrefix : kind === 'dp' ? settings.numbering.dpPrefix : settings.numbering.refundPrefix;
    const number = generateNumber(prefix, settings.numbering, kind);
    const newDoc: AnyDoc = {
      id: uid(),
      kind,
      number,
      date: formatDate(new Date()),
      customer: '',
      tempo: '30 hari',
      transport: 0,
      items: [{ id: uid(), name: '', qty: 1, price: 0, discount: 0 }],
      notes: '',
      createdAt: Date.now(),
      status: config.defaultStatus as never,
      ...(kind === 'dp' ? { relatedInvoice: '', paymentMethod: '' } : {}),
      ...(kind === 'refund' ? { relatedInvoice: '', reason: '', paymentMethod: '' } : {}),
    } as AnyDoc;
    setDocs([newDoc, ...docs]);
    setSettings({ ...settings, numbering: { ...settings.numbering, running: { ...settings.numbering.running, [kind]: (settings.numbering.running[kind] ?? 0) + 1 } } });
    setSelectedId(newDoc.id);
    setEditing(true);
  };

  const handleSave = (doc: AnyDoc) => {
    setDocs(docs.map((d) => d.id === doc.id ? doc : d));
    setEditing(false);
  };

  const handleDuplicate = () => {
    if (!selected) return;
    const copy: AnyDoc = { ...selected, id: uid(), number: `${selected.number}-COPY`, status: config.defaultStatus as never, items: selected.items.map((it) => ({ ...it, id: uid() })), createdAt: Date.now() } as AnyDoc;
    setDocs([copy, ...docs]);
    setSelectedId(copy.id);
    setEditing(true);
  };

  const handleDelete = () => {
    if (!selected || !window.confirm(`Hapus ${config.title} ini?`)) return;
    const remaining = docs.filter((d) => d.id !== selected.id);
    setDocs(remaining);
    setSelectedId(remaining[0]?.id ?? '');
  };

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    if (previewRef.current) await exportPDF(previewRef.current, selected.number, true);
  };

  const handleDownloadPNG = async () => {
    if (previewRef.current) {
      const { exportPNG } = await import('./lib');
      await exportPNG(previewRef.current, selected.number);
    }
  };

  if (editing && selected) {
    return <DocumentEditor doc={selected} branding={branding} onSave={handleSave} onCancel={() => setEditing(false)} />;
  }

  return (
    <div className="workspace">
      <section className="workspace-head">
        <div>
          <p className="eyebrow">{config.title.toUpperCase()}</p>
          <h2>{config.title} Anda</h2>
          <p className="muted">Kelola dokumen {config.title.toLowerCase()} Rencang Resik.</p>
        </div>
        <button className="primary-btn" onClick={handleCreate}><Plus size={17} /> Buat {config.title}</button>
      </section>

      <div className="split-workspace">
        <section className="list-panel">
          <div className="panel-top">
            <div><h3>Semua {config.title}</h3><span className="muted small">{docs.length} dokumen</span></div>
            <div className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari..." /></div>
          </div>
          <div className="table-wrap">
            <table className="list-table">
              <thead><tr><th>Nomor</th><th>Customer</th><th>Tanggal</th><th>Total</th><th>Status</th><th /></tr></thead>
              <tbody>
                {visible.map((d) => (
                  <tr key={d.id} className={selected?.id === d.id ? 'selected-row' : ''} onClick={() => setSelectedId(d.id)}>
                    <td><strong>{d.number}</strong><span className="subline">Tempo {d.tempo}</span></td>
                    <td>{d.customer || 'Belum diisi'}</td>
                    <td>{d.date}</td>
                    <td><strong>{money(docTotal(d))}</strong></td>
                    <td><span className={`status-pill ${d.status === 'LUNAS' ? 'paid' : d.status === 'BELUM LUNAS' || d.status === 'REQUESTED' ? 'unpaid' : ''}`}>{d.status}</span></td>
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
            {docs.length === 0 && <div className="empty-state"><p>Belum ada {config.title.toLowerCase()}</p><button className="text-btn" onClick={handleCreate}>Buat sekarang</button></div>}
          </div>
        </section>

        <section className="preview-panel">
          <div className="preview-head">
            <div><span className="eyebrow">PRATINJAU</span><h3>{selected?.number ?? '—'}</h3></div>
            <button className="icon-button" onClick={handleDuplicate} title="Duplikat"><Copy size={16} /></button>
          </div>
          {selected && (
            <>
              <div ref={previewRef}>
                <DocumentTemplate doc={selected} branding={branding} />
              </div>
              <div className="preview-actions">
                <button className="secondary-btn" onClick={() => setEditing(true)}><Pencil size={15} /> Edit</button>
                <button className="secondary-btn" onClick={handlePrint}><Printer size={15} /> Cetak</button>
                <button className="secondary-btn" onClick={handleDownloadPDF}><ArrowDownToLine size={15} /> PDF</button>
                <button className="secondary-btn" onClick={handleDownloadPNG}><ArrowDownToLine size={15} /> PNG</button>
                <button className="danger-btn" onClick={handleDelete}><Trash2 size={15} /></button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
