"use client";
import { ReactElement, CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { Container } from './styles';
import { IconSpan } from '../IconSpan';
import { DropDownProps, Styling } from './types';
import { useTheme } from 'styled-components';
import { DropDownList } from './DropDownList';

export const DropDown = ({ children, dropDownId, toggleId, items, height, style }: DropDownProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [sizing, setSizing] = useState<Styling>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

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
        boxShadow: `0px 0px 8px 0px ${theme.colors.shadowColor} inset`,
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
  }, [isOpen, style, theme.colors.mainBg, theme.colors.shadowColor]);

  return (
    <Container
      height={height}
      ref={containerRef}
      style={style as CSSProperties}
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
