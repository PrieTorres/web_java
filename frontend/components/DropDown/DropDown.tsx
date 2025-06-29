"use client";
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Container } from './styles';
import { IconSpan } from '../IconSpan';
import { DropDownProps, Styling } from './types';
import { theme } from '@/styles/theme';
import { DropDownList } from './DropDownList';

export const DropDown = ({ children, dropDownId, toggleId, items, height, style }: DropDownProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [sizing, setSizing] = useState<Styling>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const defineDropListSizing = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const styles: Styling = {
        top: rect.top,
        left: rect.left,
        clientHeight: rect.height,
        width: containerRef.current.clientWidth,
        background: window.getComputedStyle(containerRef.current).background ?? theme.colors.mainBg,
        padding: window.getComputedStyle(containerRef.current).padding,
        outline: window.getComputedStyle(containerRef.current?.parentElement as Element)?.border,
        boxShadow: '0px 0px 8px 0px #000000d8 inset',
        listStyle: 'none',
        ...(style || {}),
      };

      setSizing(styles);
    };

    defineDropListSizing();
    window.addEventListener('resize', defineDropListSizing);

    return () => {
      window.removeEventListener('resize', defineDropListSizing);
    };
  }, [isOpen, style]);

  return (
    <Container height={height} ref={containerRef} style={style}
      onClick={toggle}
    >
      <button
        id={dropDownId}
        data-dropdown-toggle={toggleId}
        data-dropdown-delay="500"
        className="text-center inline-flex items-center"
      >
        {children} <IconSpan icon="arrow_drop_down" />
      </button>
      {isOpen && (
        <DropDownList
          toggleFunction={toggle}
          items={items}
          isOpen={isOpen}
          dropDownId={dropDownId}
          toggleId={toggleId}
          offset={sizing}
        />
      )}
    </Container>
  );
};
