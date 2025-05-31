import { ReactElement } from 'react';
import * as Styled from './styles';
import { DotButton } from '../DotButton';
import { IconButton } from '../IconButton';

interface CarouselSelectorProps {
  indexCarousel: number;
  itemsLength: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const CarouselSelector = ({ indexCarousel, setIndex, itemsLength }: CarouselSelectorProps): ReactElement => {
  const previousClick = () => {
    setIndex((prev: number) => Math.max(prev - 1, 0));
  }

  const nextClick = () => {
    setIndex((prev: number) => Math.min(prev + 1, itemsLength - 1));
  }

  const displayDots = (max: number) => {
    return new Array(max).fill(null).map((_, i) =>
      <div key={i}>
        <DotButton selected={indexCarousel === i} onClick={() => setIndex(i)} />
      </div>
    );
  }

  return (
    <Styled.Container>
      <IconButton
        onClick={previousClick}
        icon="arrow_left"
      />
      <div style={{ display: 'flex', gap: 4, padding: 8 }}>
        {displayDots(itemsLength)}
      </div>
      <IconButton
        onClick={nextClick}
        icon="arrow_right"
      />
    </Styled.Container>
  )
}
