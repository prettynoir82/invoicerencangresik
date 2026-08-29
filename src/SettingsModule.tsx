import { type ChangeEvent } from 'react';
import { Stamp } from 'lucide-react';
import { type Branding, type NumberingConfig } from './types';

type Props = {
  branding: Branding;
  setBranding: (b: Branding) => void;
  numbering: NumberingConfig;
  setNumbering: (n: NumberingConfig) => void;
};

export function SettingsModule({ branding, setBranding, numbering, setNumbering }: Props) {
  const updateAsset = (field: keyof Branding, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBranding({ ...branding, [field]: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const assets: { field: keyof Branding; label: string }[] = [
    { field: 'logo', label: 'Logo Rencang Resik' },
    { field: 'stamp', label: 'Stempel resmi' },
    { field: 'paidStamp', label: 'Stempel LUNAS' },
    { field: 'signature', label: 'Tanda tangan' },
  ];

  return (
    <div className="workspace settings-panel">
      <section className="workspace-head">
        <div><p className="eyebrow">PENGATURAN</p><h2>Identitas Dokumen</h2><p className="muted">Unggah aset dan atur informasi usaha.</p></div>
      </section>
      <div className="settings-grid">
        {assets.map(({ field, label }) => (
          <label className="asset-upload" key={field}>
            <span>{label}</span>
            <div className="asset-preview">
              {branding[field]
                ? <img src={branding[field]} alt={label} />
                : <><Stamp size={20} /><small>Belum ada file</small></>}
            </div>
            <input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={(e) => updateAsset(field, e)} />
          </label>
        ))}
      </div>
      <div className="form-section company-settings">
        <h3>Informasi usaha</h3>
        <div className="form-grid">
          <label className="field"><span>Nama usaha</span><input value={branding.company} onChange={(e) => setBranding({ ...branding, company: e.target.value })} /></label>
          <label className="field"><span>Alamat</span><input value={branding.address} onChange={(e) => setBranding({ ...branding, address: e.target.value })} /></label>
          <label className="field"><span>Telepon</span><input value={branding.phone} onChange={(e) => setBranding({ ...branding, phone: e.target.value })} /></label>
          <label className="field"><span>Email</span><input value={branding.email} onChange={(e) => setBranding({ ...branding, email: e.target.value })} /></label>
          <label className="field"><span>Instagram</span><input value={branding.instagram} onChange={(e) => setBranding({ ...branding, instagram: e.target.value })} /></label>
          <label className="field"><span>Footer dokumen</span><input value={branding.footer} onChange={(e) => setBranding({ ...branding, footer: e.target.value })} /></label>
        </div>
      </div>
      <div className="form-section">
        <h3>Penomoran dokumen</h3>
        <div className="form-grid">
          <label className="field"><span>Prefix Invoice</span><input value={numbering.invoicePrefix} onChange={(e) => setNumbering({ ...numbering, invoicePrefix: e.target.value })} /></label>
          <label className="field"><span>Prefix DP</span><input value={numbering.dpPrefix} onChange={(e) => setNumbering({ ...numbering, dpPrefix: e.target.value })} /></label>
          <label className="field"><span>Prefix Refund</span><input value={numbering.refundPrefix} onChange={(e) => setNumbering({ ...numbering, refundPrefix: e.target.value })} /></label>
        </div>
        <p className="muted small" style={{ marginTop: 10 }}>Format: {numbering.invoicePrefix}/{'{nomor}'}/{'{tahun}'}/{'{bulan}'}</p>
      </div>
    </div>
  );
}
