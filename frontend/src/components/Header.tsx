import React from 'react';
import '../styles/header.css';
import { People } from "@navikt/ds-icons";

function Header() {
  return (
    <div className="header">
      <img src={require("../images/logo.jpg")} alt="" className="logo"/>
      <a> Totaloversikt </a>
      <a> Prognoser </a>
      <a> Din skole </a>
      <People color="black" className="people-icon"/>
      
    </div>
  );
}

export default Header;
