import React from 'react';
import { Estimate, Invoice } from '../../../types/types';
import { Hexagon } from 'lucide-react';

interface DocumentPreviewProps {
  type: 'estimate' | 'invoice';
  data: Estimate | Invoice;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ type, data }) => {
  const isEstimate = type === 'estimate';
  const title = isEstimate ? 'ESTIMATE' : 'INVOICE';
  const idLabel = isEstimate ? 'Estimate #' : 'Invoice #';
  
  // Type guards
  const expiryDate = (data as Estimate).expiryDate;
  const dueDate = (data as Invoice).dueDate;
  
  return (
    <div id="printable-document" className="bg-white p-8 md:p-12 max-w-4xl min-w-[700px] mx-auto shadow-none print:shadow-none print:min-w-0 text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
        <div>
           <div className="flex items-center gap-2 text-primary-600 mb-4">
              <Hexagon className="w-8 h-8 fill-primary-100" />
              <span className="text-xl font-bold tracking-tight text-slate-900">Joyous Industries</span>
           </div>
           <div className="text-sm text-slate-500">
              <p>123 Innovation Drive</p>
              <p>Mumbai, MH 400001</p>
              <p>India</p>
              <p>support@joyous.com</p>
           </div>
        </div>
        <div className="text-right">
           <h1 className="text-4xl font-bold text-slate-200 tracking-widest uppercase mb-2">{title}</h1>
           <p className="font-semibold text-lg text-slate-700">{idLabel} {data.id}</p>
           <p className="text-sm text-slate-500 mt-1">Date: {new Date(data.date).toLocaleDateString()}</p>
           {isEstimate && expiryDate && (
             <p className="text-sm text-slate-500">Expiry: {new Date(expiryDate).toLocaleDateString()}</p>
           )}
           {!isEstimate && dueDate && (
             <p className="text-sm text-slate-500">Due Date: {new Date(dueDate).toLocaleDateString()}</p>
           )}
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
        <p className="text-lg font-semibold text-slate-800">{data.customerName}</p>
        {'customerEmail' in data && data.customerEmail && (
          <p className="text-sm text-slate-500">{data.customerEmail}</p>
        )}
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-slate-800">
            <th className="text-left py-3 text-sm font-bold uppercase tracking-wider">Description</th>
            <th className="text-right py-3 text-sm font-bold uppercase tracking-wider w-24">Qty</th>
            <th className="text-right py-3 text-sm font-bold uppercase tracking-wider w-32">Rate</th>
            <th className="text-right py-3 text-sm font-bold uppercase tracking-wider w-32">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.items.map((item) => (
            <tr key={item.id}>
              <td className="py-3 text-sm font-medium">{item.description}</td>
              <td className="py-3 text-sm text-right">{item.quantity}</td>
              <td className="py-3 text-sm text-right">₹ {item.rate.toLocaleString()}</td>
              <td className="py-3 text-sm text-right font-medium">₹ {item.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal:</span>
            <span className="font-medium">₹ {data.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Tax (18%):</span>
            <span className="font-medium">₹ {data.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2 mt-2">
            <span>Total:</span>
            <span>₹ {data.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer & Signature */}
      <div className="grid grid-cols-2 gap-8 items-end border-t border-slate-200 pt-8">
         <div>
            <h4 className="font-bold text-sm mb-2">Notes</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              {isEstimate 
                ? "This estimate is valid for the expiry date indicated above. Prices are subject to change after the expiration date."
                : "Thank you for your business. Please make payment within the due date."}
            </p>
         </div>
         <div className="text-right">
            {data.signature ? (
               <div className="inline-block text-center">
                  <img src={data.signature} alt="Signature" className="h-16 mb-2 mx-auto" />
                  <p className="text-xs font-medium border-t border-slate-300 pt-1 px-4 inline-block">Authorized Signature</p>
               </div>
            ) : (
               <div className="h-20"></div>
            )}
            <p className="text-xs text-slate-400 mt-2">Generated by {data.salesPersonName}</p>
         </div>
      </div>
    </div>
  );
};