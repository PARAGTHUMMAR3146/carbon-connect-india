import React, { useState } from 'react';
import { X, FileText, Download, Calendar, Filter } from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';

interface Transaction {
  id: string;
  type: string;
  creditType: string;
  amount: number;
  pricePerTonne: number;
  totalValue: number;
  buyerName?: string;
  sellerName?: string;
  status: string;
  createdAt: string;
}

interface ReportsModalProps {
  lang: Language;
  transactions: Transaction[];
  onClose: () => void;
}

const ReportsModal: React.FC<ReportsModalProps> = ({ lang, transactions, onClose }) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];
  
  const [dateRange, setDateRange] = useState('all');
  const [reportType, setReportType] = useState('all');

  const downloadCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Type', 'Credit Type', 'Amount (tonnes)', 'Price/tonne (₹)', 'Total Value (₹)', 'Status'];
    const rows = transactions.map(txn => [
      txn.id,
      new Date(txn.createdAt).toLocaleDateString(),
      txn.type,
      txn.creditType,
      txn.amount,
      txn.pricePerTonne,
      txn.totalValue,
      txn.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `carbonmax-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const downloadPDF = () => {
    // In a real app, this would generate a proper PDF
    // For now, we'll create a formatted text file
    const content = `
CARBONMAX TRANSACTION REPORT
Generated: ${new Date().toLocaleString()}
=====================================

Total Transactions: ${transactions.length}
Total Volume: ${transactions.reduce((sum, t) => sum + t.amount, 0)} tonnes
Total Value: ₹${transactions.reduce((sum, t) => sum + t.totalValue, 0).toLocaleString('en-IN')}

TRANSACTION DETAILS:
${transactions.map(txn => `
ID: ${txn.id}
Date: ${new Date(txn.createdAt).toLocaleDateString()}
Type: ${txn.type}
Amount: ${txn.amount} tonnes
Value: ₹${txn.totalValue.toLocaleString('en-IN')}
Status: ${txn.status}
---`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `carbonmax-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalValue = transactions.reduce((sum, t) => sum + t.totalValue, 0);

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl max-w-2xl w-full shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="bg-muted p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center">
                <FileText size={24} className="text-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{t('reports')}</h2>
                <p className="text-sm text-muted-foreground">
                  {lang === 'en' ? 'Download transaction reports' : 'लेन-देन रिपोर्ट डाउनलोड करें'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-card transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Calendar size={16} />
                {lang === 'en' ? 'Date Range' : 'तारीख सीमा'}
              </label>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="input-modern"
              >
                <option value="all">{lang === 'en' ? 'All Time' : 'सभी समय'}</option>
                <option value="week">{lang === 'en' ? 'Last 7 Days' : 'पिछले 7 दिन'}</option>
                <option value="month">{lang === 'en' ? 'Last 30 Days' : 'पिछले 30 दिन'}</option>
                <option value="quarter">{lang === 'en' ? 'Last 3 Months' : 'पिछले 3 महीने'}</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Filter size={16} />
                {lang === 'en' ? 'Transaction Type' : 'लेन-देन प्रकार'}
              </label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="input-modern"
              >
                <option value="all">{lang === 'en' ? 'All Transactions' : 'सभी लेन-देन'}</option>
                <option value="buy">{lang === 'en' ? 'Purchases Only' : 'केवल खरीद'}</option>
                <option value="sell">{lang === 'en' ? 'Sales Only' : 'केवल बिक्री'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground mb-4">
            {lang === 'en' ? 'Report Summary' : 'रिपोर्ट सारांश'}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
              <p className="text-sm text-muted-foreground">
                {lang === 'en' ? 'Transactions' : 'लेन-देन'}
              </p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{totalVolume.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                {lang === 'en' ? 'Total Tonnes' : 'कुल टन'}
              </p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">₹{totalValue.toLocaleString('en-IN')}</p>
              <p className="text-sm text-muted-foreground">
                {lang === 'en' ? 'Total Value' : 'कुल मूल्य'}
              </p>
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="p-6">
          <h3 className="font-semibold text-foreground mb-4">
            {lang === 'en' ? 'Download Format' : 'डाउनलोड प्रारूप'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={downloadCSV}
              className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-emerald-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Download size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">CSV Format</p>
                <p className="text-sm text-muted-foreground">
                  {lang === 'en' ? 'For Excel, Sheets' : 'Excel, Sheets के लिए'}
                </p>
              </div>
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-emerald-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <FileText size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">PDF Report</p>
                <p className="text-sm text-muted-foreground">
                  {lang === 'en' ? 'Formatted document' : 'फ़ॉर्मेट किया गया दस्तावेज़'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;
