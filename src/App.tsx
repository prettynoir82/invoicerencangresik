import { useEffect, useState } from 'react';
import { LayoutDashboard, Receipt, CircleDollarSign, Archive, Sparkles, Bell, Settings2 } from 'lucide-react';
import { type AnyDoc, type ThankYouCard, type AnnouncementDoc, type Branding, type NumberingConfig, type ModuleKey, defaultBranding, defaultNumbering } from './types';
import { readStore, writeStore, uid } from './lib';
import { DocumentWorkspace } from './DocumentWorkspace';
import { ThankYouModule } from './ThankYouModule';
import { AnnouncementModule } from './AnnouncementModule';
import { SettingsModule } from './SettingsModule';
import { Dashboard } from './Dashboard';

const sampleItems = [
  { id: uid(), name: 'Kamar mandi (26) dan tempat wudhu (4)', qty: 1, price: 2117000, discount: 423400 },
  { id: uid(), name: 'DC dapur dan cuci peralatan', qty: 1, price: 150000, discount: 0 },
  { id: uid(), name: 'Tempat wudhu depan', qty: 1, price: 70000, discount: 0 },
];

const sampleInvoice: AnyDoc = {
  id: uid(), kind: 'invoice', number: 'INV/330/2026/08', date: '25/08/26', customer: 'SMK Batik 1 Surakarta',
  tempo: '30 hari', transport: 0, items: sampleItems, notes: '', createdAt: Date.now(), status: 'LUNAS',
} as AnyDoc;

const navItems: { key: ModuleKey; label: string; icon: typeof Receipt }[] = [
  { key: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
  { key: 'invoice', label: 'Invoice', icon: Receipt },
  { key: 'dp', label: 'DP', icon: CircleDollarSign },
  { key: 'refund', label: 'Refund', icon: Archive },
  { key: 'thankyou', label: 'Thank You', icon: Sparkles },
  { key: 'announcement', label: 'Pengumuman', icon: Bell },
  { key: 'settings', label: 'Pengaturan', icon: Settings2 },
];

const titleMap: Record<ModuleKey, string> = {
  dashboard: 'Ringkasan', invoice: 'Invoice', dp: 'DP', refund: 'Refund',
  thankyou: 'Say Thank You', announcement: 'Pengumuman', settings: 'Pengaturan',
};

function App() {
  const [active, setActive] = useState<ModuleKey>('dashboard');
  const [invoices, setInvoices] = useState<AnyDoc[]>(() => readStore('rr-invoices', [sampleInvoice]));
  const [dps, setDps] = useState<AnyDoc[]>(() => readStore('rr-dps', []));
  const [refunds, setRefunds] = useState<AnyDoc[]>(() => readStore('rr-refunds', []));
  const [thankYouCards, setThankYouCards] = useState<ThankYouCard[]>(() => readStore('rr-thankyou', []));
  const [announcements, setAnnouncements] = useState<AnnouncementDoc[]>(() => readStore('rr-announcements', []));
  const [branding, setBranding] = useState<Branding>(() => {
    const stored = readStore<Branding>('rr-branding', defaultBranding);
    return { ...defaultBranding, ...stored, logo: stored.logo || defaultBranding.logo };
  });
  const [numbering, setNumbering] = useState<NumberingConfig>(() => readStore('rr-numbering', defaultNumbering));

  useEffect(() => writeStore('rr-invoices', invoices), [invoices]);
  useEffect(() => writeStore('rr-dps', dps), [dps]);
  useEffect(() => writeStore('rr-refunds', refunds), [refunds]);
  useEffect(() => writeStore('rr-thankyou', thankYouCards), [thankYouCards]);
  useEffect(() => writeStore('rr-announcements', announcements), [announcements]);
  useEffect(() => writeStore('rr-branding', branding), [branding]);
  useEffect(() => writeStore('rr-numbering', numbering), [numbering]);
  useEffect(() => { if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {}); }, []);

  const setSettings = (s: { branding: Branding; numbering: NumberingConfig }) => {
    setBranding(s.branding);
    setNumbering(s.numbering);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar-desktop">
        <div className="brand-lockup">
          <div className="brand-mark"><img src="/WhatsApp_Image_2026-08-28_at_10.34.00.jpeg" alt="Rencang Resik" /></div>
          <div><strong>RENCANG RESIK</strong><span>Document workspace</span></div>
        </div>
        <nav>
          {navItems.map(({ key, label, icon: Icon }) => (
            <button key={key} className={active === key ? 'active' : ''} onClick={() => setActive(key)}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <header className="topbar">
        <div className="brand-lockup-mobile">
          <div className="brand-mark"><img src="/WhatsApp_Image_2026-08-28_at_10.34.00.jpeg" alt="Rencang Resik" /></div>
          <div><strong>RENCANG RESIK</strong></div>
        </div>
        <div className="topbar-title"><h1>{titleMap[active]}</h1></div>
      </header>
      <main className="main-area">
        {active === 'dashboard' && <Dashboard invoices={invoices} dps={dps} refunds={refunds} onNavigate={setActive} />}
        {active === 'invoice' && <DocumentWorkspace kind="invoice" docs={invoices} setDocs={setInvoices} settings={{ branding, numbering }} setSettings={setSettings} branding={branding} />}
        {active === 'dp' && <DocumentWorkspace kind="dp" docs={dps} setDocs={setDps} settings={{ branding, numbering }} setSettings={setSettings} branding={branding} />}
        {active === 'refund' && <DocumentWorkspace kind="refund" docs={refunds} setDocs={setRefunds} settings={{ branding, numbering }} setSettings={setSettings} branding={branding} />}
        {active === 'thankyou' && <ThankYouModule cards={thankYouCards} setCards={setThankYouCards} branding={branding} />}
        {active === 'announcement' && <AnnouncementModule announcements={announcements} setAnnouncements={setAnnouncements} branding={branding} />}
        {active === 'settings' && <SettingsModule branding={branding} setBranding={setBranding} numbering={numbering} setNumbering={setNumbering} />}
      </main>
      <nav className="bottom-nav">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button key={key} className={active === key ? 'active' : ''} onClick={() => setActive(key)}>
            <Icon size={20} /><span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
