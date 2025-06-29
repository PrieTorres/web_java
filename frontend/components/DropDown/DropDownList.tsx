"use client";
import ClientPortal from '../Portal';
import { DropDownListProps } from './types';

export const DropDownList = ({ isOpen, offset, dropDownId, toggleId, items, toggleFunction }: DropDownListProps) => {
  const transClass = isOpen ? 'flex' : 'hidden';
  const style = offset ? {
    ...offset,
    top: (offset.top ?? 0) + (offset.clientHeight ?? 0),
    left: offset.left ?? 0,
    width: offset.width,
  } : {};

  return (
    <ClientPortal>
      <div
        style={{ ...style, position: 'absolute', borderRadius: '0 0 5px 5px' }}
        id={toggleId}
        className={`flex flex-col ${transClass}`}
      >
        <ul aria-labelledby={dropDownId} style={{ listStyle: 'none' }}>
          {items.map((dropItem, i) => (
            <li
              key={`drop-item-${i}`}
              style={{ height: offset?.clientHeight, cursor: 'pointer' }}
            >
              <div
                style={{ height: '100%' }}
                onClick={(e) => {
                  dropItem.onClick(e);
                  toggleFunction();
                }}
              >
                {dropItem.children}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ClientPortal>
  );
};
