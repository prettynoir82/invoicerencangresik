import { type Branding, type AnyDoc, type DocKind, type LineItem } from './types';
import { money, itemAmount, docSubtotal, docTotal } from './lib';

const NUMBER_LABELS: Record<DocKind, string> = {
  invoice: 'No. Invoice',
  dp: 'No. DP',
  refund: 'No. Refund',
};

export function DocumentTemplate({ doc, branding }: { doc: AnyDoc; branding: Branding }) {
  const subtotal = docSubtotal(doc);
  const total = docTotal(doc);
  const isPaid = doc.kind === 'invoice' ? doc.status === 'LUNAS' : doc.kind === 'dp' && doc.status === 'LUNAS';

  return (
    <article className="doc-paper" data-doc-paper>
      <div className="doc-grid">
        <div className="doc-top-row">
          <div className="doc-logo-area">
            {branding.logo
              ? <img src={branding.logo} alt="Logo" className="doc-logo-img" />
              : <div className="doc-logo-placeholder"><span>RENCANG</span><b>RESIK</b></div>}
          </div>
          <div className="doc-header-info">
            <InfoRow label="Tanggal" value={doc.date} />
            <InfoRow label="Nama Customer" value={doc.customer || '—'} />
            <InfoRow label="Tempo" value={doc.tempo} />
          </div>
        </div>

        <div className="doc-number-row">
          {NUMBER_LABELS[doc.kind]} : <strong>{doc.number}</strong>
        </div>

        <table className="doc-table">
          <thead>
            <tr>
              <th className="col-no">No.</th>
              <th className="col-name">Jenis Layanan</th>
              <th className="col-qty">Qty</th>
              <th className="col-price">Harga</th>
              <th className="col-disc">Diskon</th>
              <th className="col-amount">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((item, i) => <ItemRow key={item.id} item={item} index={i} />)}
            {Array.from({ length: Math.max(0, 5 - doc.items.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="doc-empty-row"><td colSpan={6} /></tr>
            ))}
          </tbody>
        </table>

        <div className="doc-bottom-area">
          <div className="doc-bottom-left">
            <div className="doc-recipient">
              <strong>Penerima</strong>
              <span>(....................)</span>
            </div>
          </div>
          <div className="doc-bottom-right">
            <div className="doc-totals">
              <div><span>Sub total</span><strong>{money(subtotal)}</strong></div>
              <div><span>Transportasi</span><strong>{money(doc.transport)}</strong></div>
              <div className="doc-total-line">
                <span>Total biaya</span>
                <strong className="doc-total-value">{money(total)}</strong>
                {isPaid && <img src="/Tanda_lunas copy 2.png" alt="LUNAS" className="doc-paid-stamp-img" />}
              </div>
            </div>
          </div>
        </div>

        <div className="doc-sign-area">
          <div className="doc-sign-spacer" />
          <div className="doc-signing">
            <span>Dengan hormat,</span>
            <div className="doc-sign-stack">
              <img src={branding.stamp || "/Stempel_rencang_resik.png"} alt="Stempel" className="doc-official-stamp" />
              <img src="/Tandatangan-1.png" alt="Tanda tangan" className="doc-signature-img" />
            </div>
            <strong>(Rencang Resik)</strong>
          </div>
        </div>
      </div>
      <div className="doc-footer">"{branding.footer}"</div>
    </article>
  );
}

function ItemRow({ item, index }: { item: LineItem; index: number }) {
  return (
    <tr>
      <td className="center">{index + 1}</td>
      <td>{item.name || '—'}</td>
      <td className="center">{item.qty}</td>
      <td className="right">{money(item.price)}</td>
      <td className="right">{money(item.discount)}</td>
      <td className="right">{money(itemAmount(item))}</td>
    </tr>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><b>:</b><strong>{value}</strong></div>;
}
