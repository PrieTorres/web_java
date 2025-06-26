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
    // {
    //   children: "about",
    //   link: "/about",
    // },
  ];

  return (
    <Container>
      <NavLinks links={menuTabs} />
    </Container>
  )
}
