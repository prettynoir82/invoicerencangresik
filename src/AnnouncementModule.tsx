import { useRef, useState } from 'react';
import { ArrowDownToLine, FileText, MessageCircle, Plus, Trash2, Instagram, Share2, Music2 } from 'lucide-react';
import { type AnnouncementDoc, type Branding, FONT_OPTIONS, COLOR_OPTIONS, SIZE_OPTIONS } from './types';
import { uid, exportPNG, exportJPG, exportPDF, exportWord, shareImageToWhatsApp, shareToSocial } from './lib';

type Props = {
  announcements: AnnouncementDoc[];
  setAnnouncements: (a: AnnouncementDoc[]) => void;
  branding: Branding;
};

export function AnnouncementModule({ announcements, setAnnouncements, branding }: Props) {
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(announcements[0]?.id ?? '');
  const previewRef = useRef<HTMLDivElement>(null);
  const selected = announcements.find((a) => a.id === selectedId) ?? announcements[0];

  const create = () => {
    const ann: AnnouncementDoc = {
      id: uid(),
      title: '',
      date: new Date().toLocaleDateString('id-ID'),
      content: '',
      category: 'Promosi',
      font: 'Poppins',
      color: '#fdf2f8',
      size: 'ig-feed',
      published: false,
      createdAt: Date.now(),
    };
    setAnnouncements([ann, ...announcements]);
    setSelectedId(ann.id);
    setEditing(true);
  };

  const update = (patch: Partial<AnnouncementDoc>) => {
    if (!selected) return;
    setAnnouncements(announcements.map((a) => a.id === selected.id ? { ...a, ...patch } : a));
  };

  const remove = (id: string) => {
    if (!window.confirm('Hapus pengumuman ini?')) return;
    const remaining = announcements.filter((a) => a.id !== id);
    setAnnouncements(remaining);
    setSelectedId(remaining[0]?.id ?? '');
  };

  const buildWordContent = (a: AnnouncementDoc) => {
    return `<h1>${a.title}</h1><p><strong>Tanggal:</strong> ${a.date} · <strong>Kategori:</strong> ${a.category}</p><hr><p style="white-space:pre-wrap">${a.content}</p><br><p><strong>${branding.company}</strong><br>${branding.address}<br>${branding.phone} · ${branding.instagram}</p>`;
  };

  if (editing && selected) {
    const sizeOpt = SIZE_OPTIONS.find((s) => s.value === selected.size) ?? SIZE_OPTIONS[0];
    return (
      <div className="editor-layout">
        <div className="editor-form">
          <button className="back-link" onClick={() => setEditing(false)}>← Kembali</button>
          <div className="editor-title"><div><p className="eyebrow">PENGUMUMAN</p><h2>{selected.title || 'Pengumuman baru'}</h2></div></div>
          <div className="form-section">
            <h3>Isi pengumuman</h3>
            <div className="form-grid">
              <label className="field"><span>Judul</span><input value={selected.title} onChange={(e) => update({ title: e.target.value })} /></label>
              <label className="field"><span>Tanggal</span><input value={selected.date} onChange={(e) => update({ date: e.target.value })} /></label>
              <label className="field"><span>Kategori</span>
                <select className="select-input" value={selected.category} onChange={(e) => update({ category: e.target.value })}>
                  <option>Umum</option><option>Promosi</option><option>Info</option><option>Jadwal</option>
                </select>
              </label>
            </div>
            <label className="field" style={{ marginTop: 15 }}><span>Isi</span><textarea className="notes-area" rows={6} value={selected.content} onChange={(e) => update({ content: e.target.value })} /></label>
          </div>
          <div className="form-section">
            <h3>Desain untuk sosmed</h3>
            <div className="form-grid">
              <label className="field"><span>Font</span>
                <select className="select-input" value={selected.font} onChange={(e) => update({ font: e.target.value })}>
                  {FONT_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </label>
              <label className="field"><span>Ukuran</span>
                <select className="select-input" value={selected.size} onChange={(e) => update({ size: e.target.value })}>
                  {SIZE_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
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
            <AnnouncementPreview ann={selected} branding={branding} />
          </div>
          <div className="share-section">
            <p className="share-label">Bagikan langsung ke</p>
            <div className="social-share-row">
              <button className="social-btn social-ig" onClick={async () => previewRef.current && await shareToSocial(previewRef.current, `pengumuman-${selected.title || 'rr'}.png`, 'instagram', selected.title)}><Instagram size={16} /> Instagram Story</button>
              <button className="social-btn social-threads" onClick={async () => previewRef.current && await shareToSocial(previewRef.current, `pengumuman-${selected.title || 'rr'}.png`, 'threads', selected.title)}><Share2 size={16} /> Threads</button>
              <button className="social-btn social-tiktok" onClick={async () => previewRef.current && await shareToSocial(previewRef.current, `pengumuman-${selected.title || 'rr'}.png`, 'tiktok', selected.title)}><Music2 size={16} /> TikTok</button>
            </div>
            <p className="share-label">Unduh / bagikan lain</p>
            <div className="preview-actions" style={{ flexWrap: 'wrap' }}>
              <button className="secondary-btn" onClick={async () => previewRef.current && await exportPNG(previewRef.current, `pengumuman-${selected.title || 'rr'}`)}><ArrowDownToLine size={15} /> PNG</button>
              <button className="secondary-btn" onClick={async () => previewRef.current && await exportJPG(previewRef.current, `pengumuman-${selected.title || 'rr'}`)}><ArrowDownToLine size={15} /> JPG</button>
              <button className="secondary-btn" onClick={async () => previewRef.current && await exportPDF(previewRef.current, `pengumuman-${selected.title || 'rr'}`)}><ArrowDownToLine size={15} /> PDF</button>
              <button className="secondary-btn" onClick={() => exportWord(buildWordContent(selected), `pengumuman-${selected.title || 'rr'}`)}><FileText size={15} /> Word</button>
              <button className="secondary-btn" onClick={async () => previewRef.current && await shareImageToWhatsApp(previewRef.current, `pengumuman-${selected.title || 'rr'}.png`, selected.title)}><MessageCircle size={15} /> WhatsApp</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace">
      <section className="workspace-head">
        <div><p className="eyebrow">PENGUMUMAN</p><h2>Pengumuman & Sosmed</h2><p className="muted">Buat konten pengumuman untuk Instagram, Threads, dan TikTok.</p></div>
        <button className="primary-btn" onClick={create}><Plus size={17} /> Buat pengumuman</button>
      </section>
      {announcements.length === 0 ? (
        <div className="empty-state"><p>Belum ada pengumuman</p><button className="text-btn" onClick={create}>Buat sekarang</button></div>
      ) : (
        <div className="ann-list">
          {announcements.map((a) => (
            <div key={a.id} className="ann-item" onClick={() => { setSelectedId(a.id); setEditing(true); }}>
              <div className="ann-item-info">
                <span className={`ann-badge ${a.published ? 'published' : ''}`}>{a.published ? 'Terbit' : 'Draft'}</span>
                <strong>{a.title || 'Tanpa judul'}</strong>
                <span className="muted small">{a.date} · {a.category}</span>
              </div>
              <button className="danger-btn" onClick={(e) => { e.stopPropagation(); remove(a.id); }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnnouncementPreview({ ann, branding }: { ann: AnnouncementDoc; branding: Branding }) {
  const sizeOpt = SIZE_OPTIONS.find((s) => s.value === ann.size) ?? SIZE_OPTIONS[0];
  const colorOpt = COLOR_OPTIONS.find((c) => c.value === ann.color) ?? COLOR_OPTIONS[0];
  const fontStack = `'${ann.font}', sans-serif`;
  const scale = 0.3;
  const textColor = colorOpt.text ?? '#fff';
  const isLight = textColor !== '#fff';
  const isStory = sizeOpt.h > sizeOpt.w;

  return (
    <div style={{
      width: sizeOpt.w * scale,
      height: sizeOpt.h * scale,
      background: isLight
        ? `linear-gradient(160deg, ${ann.color}, ${ann.color === '#ffffff' ? '#fce7f3' : '#fbcfe8'})`
        : `linear-gradient(160deg, ${ann.color}, ${ann.color}dd)`,
      color: textColor,
      fontFamily: fontStack,
      borderRadius: 14,
      padding: `${24 * scale}px ${28 * scale}px`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 6px 20px rgba(0,0,0,.10)',
    }}>
      {isLight && (
        <div style={{ position: 'absolute', top: -25 * scale, right: -25 * scale, width: 100 * scale, height: 100 * scale, borderRadius: '50%', background: '#fbcfe8', opacity: .6 }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 * scale, marginBottom: 12 * scale, position: 'relative', zIndex: 1 }}>
        {branding.logo
          ? <img src={branding.logo} alt="Logo" style={{ height: 24 * scale, objectFit: 'contain', mixBlendMode: 'multiply' }} />
          : <span style={{ fontSize: 11 * scale, fontWeight: 700, letterSpacing: '.05', color: textColor }}>RENCANG RESIK</span>}
      </div>
      <div style={{ fontSize: 8 * scale, opacity: .8, marginBottom: 6 * scale, textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600, position: 'relative', zIndex: 1 }}>{ann.category}</div>
      <h3 style={{ fontSize: isStory ? 24 * scale : 20 * scale, margin: 0, lineHeight: 1.2, marginBottom: 10 * scale, fontWeight: 700, position: 'relative', zIndex: 1 }}>{ann.title || 'Judul Pengumuman'}</h3>
      <p style={{ fontSize: 11 * scale, lineHeight: 1.55, whiteSpace: 'pre-wrap', flex: 1, opacity: .9, position: 'relative', zIndex: 1 }}>{ann.content || 'Isi pengumuman...'}</p>
      <div style={{ fontSize: 8 * scale, opacity: .75, marginTop: 10 * scale, fontWeight: 600, position: 'relative', zIndex: 1 }}>
        {branding.company} · {branding.instagram}
      </div>
    </div>
  );
}
