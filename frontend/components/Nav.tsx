import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { People } from "@navikt/ds-icons";
import logoImg from '../images/logo.jpg'
import styles from '../styles/Nav.module.css';


const Header: React.FC = () => {
  
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Image src={logoImg}/>
      </div>
      <ul>
        <li>
          <Link  href={{ pathname: '/totalOversikt', query: { id: '' } }}> Totaloversikt </Link>
        </li>
        <li>
          <Link href='/prognoser'> Prognoser </Link>
        </li>
        <li>
          <Link href='/minskole'> Min skole </Link>
        </li>
        <li>
          <Link href='/login'> 
          <People color="black" className={styles.peopleIcon}/>
          </Link>  
        </li>
        
      </ul>
      
    </nav>
  );
}

export default Header;
