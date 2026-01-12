import React from 'react';

interface CardProps {
  title: string;
  value?: string;
  details?: string;
  valueClassName?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, value, details, valueClassName = '', children }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      {children ? (
        <div className="mt-4">{children}</div>
      ) : (
        <>
          <p className={`text-4xl font-bold mt-2 ${valueClassName}`}>{value}</p>
          {details && <p className="text-sm text-slate-400 mt-2">{details}</p>}
        </>
      )}
    </div>
  );
};

export default Card;