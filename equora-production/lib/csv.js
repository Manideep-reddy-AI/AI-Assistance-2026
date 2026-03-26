export function parseCSV(text) {
  const lines = text.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) return null
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''))
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
    const row = {}
    headers.forEach((h, idx) => { row[h] = vals[idx] || '' })
    const sym = row.symbol || row.scrip || row.stock || row.name || row.stockname || row.instrumentname || vals[0]
    const qty = parseFloat(row.quantity || row.qty || row.shares || vals[1]) || 0
    const avg = parseFloat((row.averageprice || row.avgprice || row.avgcost || row.buyprice || vals[2] || '').replace(/[₹,]/g, '')) || 0
    const ltp = parseFloat((row.ltp || row.currentprice || row.marketprice || vals[3] || '').replace(/[₹,]/g, '')) || 0
    const cv = parseFloat((row.currentvalue || row.marketvalue || vals[4] || '').replace(/[₹,]/g, '')) || (qty * ltp)
    const pl = parseFloat((row.pl || row.pandl || row.unrealisedpl || vals[5] || '').replace(/[₹,+]/g, '')) || (cv - qty * avg)
    if (sym && qty > 0) rows.push({ sym: sym.toUpperCase().trim(), qty, avg, ltp, cv, pl })
  }
  return rows.length > 0 ? rows : null
}

export const SAMPLE_CSV = `Symbol,Quantity,Average Price,Current Value,P&L
RELIANCE,10,2420,28500,4300
TCS,5,3650,20500,2250
INFY,8,1480,13120,1280
HDFC BANK,15,1620,23250,-1050
ZOMATO,50,142,5800,-1300
WIPRO,20,430,9360,760
BAJFINANCE,3,6800,21600,1200
DMART,2,4200,9300,900`
