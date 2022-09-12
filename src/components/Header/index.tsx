import { HeaderContainer } from "./styles";
import LogoIgnite from '../../assets/logo-ignite.svg';
import { Timer, Scroll } from 'phosphor-react';
import { NavLink } from "react-router-dom";

export function Header(){
    return(
        <HeaderContainer>
            <img src={LogoIgnite} alt="Dois triângulos sobrepostos, sendo o logotipo." />

            <nav>
                <NavLink to="/" title="Timer">
                    <Timer size={24} />
                </NavLink>
                <NavLink to="/history" title="Histórico">
                    <Scroll size={24} />
                </NavLink>
            </nav>
        </HeaderContainer>
    );
}