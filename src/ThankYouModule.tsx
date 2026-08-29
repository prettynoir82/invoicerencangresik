import { useRef, useState } from 'react';
import { ArrowDownToLine, MessageCircle, Plus, Trash2, Instagram, Share2, Music2 } from 'lucide-react';
import { type ThankYouCard, type Branding, FONT_OPTIONS, COLOR_OPTIONS, TEMPLATE_OPTIONS, SIZE_OPTIONS, WHATSAPP_NUMBER } from './types';
import { uid, exportPNG, exportJPG, exportPDF, shareImageToWhatsApp, shareToSocial } from './lib';

type Props = {
  cards: ThankYouCard[];
  setCards: (c: ThankYouCard[]) => void;
  branding: Branding;
};

export function ThankYouModule({ cards, setCards, branding }: Props) {
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(cards[0]?.id ?? '');
  const previewRef = useRef<HTMLDivElement>(null);
  const selected = cards.find((c) => c.id === selectedId) ?? cards[0];

  const createCard = () => {
    const card: ThankYouCard = {
      id: uid(),
      customer: '',
      date: new Date().toLocaleDateString('id-ID'),
      message: 'Terima kasih telah mempercayakan kebersihan dan kenyamanan tempat Anda kepada Rencang Resik.',
      service: '',
      template: 'aesthetic',
      font: 'Dancing Script',
      color: '#fdf2f8',
      size: 'ig-feed',
      createdAt: Date.now(),
    };
    setCards([card, ...cards]);
    setSelectedId(card.id);
    setEditing(true);
  };

  const update = (patch: Partial<ThankYouCard>) => {
    if (!selected) return;
    setCards(cards.map((c) => c.id === selected.id ? { ...c, ...patch } : c));
  };

  const remove = () => {
    if (!selected || !window.confirm('Hapus kartu ini?')) return;
    const remaining = cards.filter((c) => c.id !== selected.id);
    setCards(remaining);
    setSelectedId(remaining[0]?.id ?? '');
  };

  if (editing && selected) {
    const sizeOpt = SIZE_OPTIONS.find((s) => s.value === selected.size) ?? SIZE_OPTIONS[0];
    const colorOpt = COLOR_OPTIONS.find((c) => c.value === selected.color) ?? COLOR_OPTIONS[0];
    return (
      <div className="editor-layout">
        <div className="editor-form">
          <button className="back-link" onClick={() => setEditing(false)}>← Kembali</button>
          <div className="editor-title"><div><p className="eyebrow">KARTU UCAPAN</p><h2>Terima Kasih</h2></div></div>
          <div className="form-section">
            <h3>Isi pesan</h3>
            <div className="form-grid">
              <label className="field"><span>Nama customer</span><input value={selected.customer} onChange={(e) => update({ customer: e.target.value })} /></label>
              <label className="field"><span>Tanggal</span><input value={selected.date} onChange={(e) => update({ date: e.target.value })} /></label>
              <label className="field"><span>Service / Proyek</span><input value={selected.service} onChange={(e) => update({ service: e.target.value })} placeholder="Jenis layanan" /></label>
            </div>
            <label className="field" style={{ marginTop: 15 }}><span>Pesan</span><textarea className="notes-area" rows={3} value={selected.message} onChange={(e) => update({ message: e.target.value })} /></label>
          </div>
          <div className="form-section">
            <h3>Desain</h3>
            <div className="form-grid">
              <label className="field"><span>Template</span>
                <select className="select-input" value={selected.template} onChange={(e) => update({ template: e.target.value })}>
                  {TEMPLATE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </label>
              <label className="field"><span>Ukuran</span>
                <select className="select-input" value={selected.size} onChange={(e) => update({ size: e.target.value })}>
                  {SIZE_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
              <label className="field"><span>Font</span>
                <select className="select-input" value={selected.font} onChange={(e) => update({ font: e.target.value })}>
                  {FONT_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </label>
            </div>
            <div style={{ marginTop: 15 }}>
              <span className="field-label">Warna</span>
              <div className="color-swatches">
                {COLOR_OPTIONS.map((c) => (
                  <button key={c.value} className={`color-swatch ${selected.color === c.value ? 'selected' : ''}`} style={{ background: c.value, border: c.value === '#ffffff' || c.value === '#fdf2f8' ? '1px solid #e5e7eb' : 'none' }} onClick={() => update({ color: c.value })} title={c.name} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="editor-preview">
          <span className="eyebrow">PRATINJAU — {sizeOpt.label}</span>
          <div ref={previewRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <ThankYouPreview card={selected} branding={branding} />
          </div>
          <div className="share-section">
            <p className="share-label">Bagikan langsung ke</p>
            <div className="social-share-row">
              <button className="social-btn social-ig" onClick={async () => previewRef.current && await shareToSocial(previewRef.current, `terimakasih-${selected.customer || 'card'}.png`, 'instagram', `Terima kasih dari Rencang Resik — ${selected.customer}`)}><Instagram size={16} /> Instagram Story</button>
              <button className="social-btn social-threads" onClick={async () => previewRef.current && await shareToSocial(previewRef.current, `terimakasih-${selected.customer || 'card'}.png`, 'threads', `Terima kasih dari Rencang Resik — ${selected.customer}`)}><Share2 size={16} /> Threads</button>
              <button className="social-btn social-tiktok" onClick={async () => previewRef.current && await shareToSocial(previewRef.current, `terimakasih-${selected.customer || 'card'}.png`, 'tiktok', `Terima kasih dari Rencang Resik — ${selected.customer}`)}><Music2 size={16} /> TikTok</button>
            </div>
            <p className="share-label">Unduh / bagikan lain</p>
            <div className="preview-actions">
              <button className="secondary-btn" onClick={async () => previewRef.current && await exportPNG(previewRef.current, `terimakasih-${selected.customer || 'card'}`)}><ArrowDownToLine size={15} /> PNG</button>
              <button className="secondary-btn" onClick={async () => previewRef.current && await exportJPG(previewRef.current, `terimakasih-${selected.customer || 'card'}`)}><ArrowDownToLine size={15} /> JPG</button>
              <button className="secondary-btn" onClick={async () => previewRef.current && await exportPDF(previewRef.current, `terimakasih-${selected.customer || 'card'}`)}><ArrowDownToLine size={15} /> PDF</button>
              <button className="secondary-btn" onClick={async () => previewRef.current && await shareImageToWhatsApp(previewRef.current, `terimakasih-${selected.customer || 'card'}.png`, `Terima kasih dari Rencang Resik`)}><MessageCircle size={15} /> WhatsApp</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace">
      <section className="workspace-head">
        <div><p className="eyebrow">SAY THANK YOU</p><h2>Kartu Terima Kasih</h2><p className="muted">Buat kartu ucapan untuk pelanggan — siap dibagikan ke Instagram, Threads, dan TikTok.</p></div>
        <button className="primary-btn" onClick={createCard}><Plus size={17} /> Buat kartu</button>
      </section>
      {cards.length === 0 ? (
        <div className="empty-state"><p>Belum ada kartu</p><button className="text-btn" onClick={createCard}>Buat kartu pertama</button></div>
      ) : (
        <div className="card-grid">
          {cards.map((c) => {
            const sizeOpt = SIZE_OPTIONS.find((s) => s.value === c.size) ?? SIZE_OPTIONS[0];
            return (
              <div key={c.id} className={`card-thumb ${selectedId === c.id ? 'selected' : ''}`} onClick={() => { setSelectedId(c.id); setEditing(true); }}>
                <div style={{ aspectRatio: `${sizeOpt.w} / ${sizeOpt.h}` }}>
                  <ThankYouPreview card={c} branding={branding} />
                </div>
                <div className="card-thumb-bar"><span>{c.customer || 'Tanpa nama'}</span><button className="danger-btn" onClick={(e) => { e.stopPropagation(); if (selected) { setSelectedId(c.id); remove(); } }}><Trash2 size={14} /></button></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ThankYouPreview({ card, branding }: { card: ThankYouCard; branding: Branding }) {
  const fontStack = `'${card.font}', sans-serif`;
  const sizeOpt = SIZE_OPTIONS.find((s) => s.value === card.size) ?? SIZE_OPTIONS[0];
  const colorOpt = COLOR_OPTIONS.find((c) => c.value === card.color) ?? COLOR_OPTIONS[0];
  const isElegant = card.template === 'elegant';
  const isMinimal = card.template === 'minimal';
  const isModern = card.template === 'modern';
  const isAesthetic = card.template === 'aesthetic';
  const textColor = colorOpt.text ?? '#fff';
  const isLight = textColor !== '#fff';

  const scale = 0.3;
  const dims = { width: sizeOpt.w * scale, height: sizeOpt.h * scale };
  const pad = `${24 * scale}px ${28 * scale}px`;

  let bg: string;
  let border = 'none';
  let radius = 16;

  if (isMinimal) {
    bg = '#fff';
    border = `2px solid ${card.color}`;
  } else if (isModern) {
    bg = `linear-gradient(135deg, ${card.color}, ${card.color}aa)`;
  } else if (isAesthetic) {
    bg = card.color === '#ffffff' ? '#fdf2f8' : card.color;
    radius = 24;
  } else if (isElegant) {
    bg = card.color === '#ffffff' ? '#fafafa' : card.color;
    radius = 0;
    border = `1px solid ${isLight ? '#e5c7d4' : 'rgba(255,255,255,.2)'}`;
  } else {
    bg = card.color === '#ffffff' ? '#f8fafc' : card.color;
  }

  return (
    <div style={{
      ...dims,
      background: bg,
      color: textColor,
      fontFamily: fontStack,
      borderRadius: radius,
      border,
      padding: pad,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      textAlign: 'center',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 4px 14px rgba(0,0,0,.08)',
    }}>
      {isAesthetic && (
        <div style={{ position: 'absolute', top: -30 * scale, right: -30 * scale, width: 120 * scale, height: 120 * scale, borderRadius: '50%', background: isLight ? '#fbcfe8' : 'rgba(255,255,255,.12)' }} />
      )}
      {isAesthetic && (
        <div style={{ position: 'absolute', bottom: -40 * scale, left: -40 * scale, width: 140 * scale, height: 140 * scale, borderRadius: '50%', background: isLight ? '#fce7f3' : 'rgba(255,255,255,.08)' }} />
      )}
      <div style={{ height: 40 * scale, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        {branding.logo
          ? <img src={branding.logo} alt="Logo" style={{ height: 30 * scale, objectFit: 'contain', mixBlendMode: 'multiply' }} />
          : <span style={{ fontSize: 12 * scale, fontWeight: 700, letterSpacing: '.06em', color: textColor }}>RENCANG RESIK</span>}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 * scale, position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: isElegant ? 30 * scale : 26 * scale, fontWeight: 700, margin: 0, lineHeight: 1.15 }}>Terima Kasih</p>
        <p style={{ fontSize: 18 * scale, fontWeight: 600, margin: 0 }}>{card.customer || 'Pelanggan Setia'}</p>
        <p style={{ fontSize: 12 * scale, lineHeight: 1.5, margin: 0, maxWidth: 280 * scale, opacity: .85 }}>{card.message}</p>
        {card.service && <p style={{ fontSize: 10 * scale, margin: '4px 0 0', opacity: .75 }}>Layanan: {card.service}</p>}
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 11 * scale, fontWeight: 600, margin: 0 }}>{branding.company}</p>
        <p style={{ fontSize: 9 * scale, margin: '2px 0 0', opacity: .7 }}>{branding.instagram} · {branding.phone}</p>
      </div>
    </div>
  );
}
