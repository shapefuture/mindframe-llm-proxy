import React, { useState, ReactNode } from 'react';

export interface AccordionItem {
  title: string;
  content: ReactNode;
  id?: string | number;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number;
  allowMultipleOpen?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
  allowMultipleOpen = false,
  className = '',
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([defaultOpenIndex]);

  const toggleIndex = (idx: number) => {
    setOpenIndexes((prev) => {
      if (prev.includes(idx)) {
        return allowMultipleOpen ? prev.filter(i => i !== idx) : [];
      }
      return allowMultipleOpen ? [...prev, idx] : [idx];
    });
  };

  return (
    <div className={`w-full ${className}`}>
      {items.map((item, idx) => (
        <div key={item.id ?? idx} className="border-b last:border-b-0">
          <button
            className="w-full flex justify-between items-center py-3 px-4 text-left font-medium focus:outline-none hover:bg-muted transition-colors"
            onClick={() => toggleIndex(idx)}
            aria-expanded={openIndexes.includes(idx)}
            aria-controls={`accordion-content-${idx}`}
            id={`accordion-control-${idx}`}
            type="button"
          >
            <span>{item.title}</span>
            <span className="ml-3 text-xl">{openIndexes.includes(idx) ? '−' : '+'}</span>
          </button>
          <div
            id={`accordion-content-${idx}`}
            role="region"
            aria-labelledby={`accordion-control-${idx}`}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndexes.includes(idx) ? 'max-h-96 opacity-100 py-2 px-4 bg-secondary/20' : 'max-h-0 opacity-0 py-0 px-4'}`}
            style={{}}
          >
            {openIndexes.includes(idx) && (
              <div>{item.content}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
