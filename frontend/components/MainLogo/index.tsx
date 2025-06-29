import { ReactElement } from 'react';
import { Container } from './styles';
import ActiveLink from '../ActiveLink';
import { SafeImage } from '../SafeImage';

export const MainLogo = (): ReactElement => {
  return (
    <Container>
      <ActiveLink href="/" target="_self">
        <SafeImage
          src="/public/assets/img/pets_icon.png"
          alt="Logo do site Adote um animalzinho"
          width={50}
          height={50}
          className="rounded-full"
        />
      </ActiveLink>
    </Container>
  );
};