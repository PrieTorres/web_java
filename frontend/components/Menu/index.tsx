import { MenuLinkProps } from "../MenuLink";
import { NavLinks } from "../NavLinks";
import { Container } from "./styles";

export const Menu = () => {
  const menuTabs: MenuLinkProps[] = [
    {
      children: "home",
      link: "/",
    },
    {
      children: "cadastrar pet",
      link: "/petForm",
    },
    {
      children: "pets para adoção",
      link: "/allPets",
    },
    {
      children: "meus pets",
      link: "/myPets",
    },
  ];

  return (
    <Container>
      <NavLinks links={menuTabs} />
    </Container>
  )
}
