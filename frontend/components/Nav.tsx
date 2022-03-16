import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { People } from "@navikt/ds-icons";
import logoImg from '../images/logo.jpg'
import styles from '../styles/Nav.module.css';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { SxProps } from '@mui/system';


const Header: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };
  const dropdownProps: SxProps = {
    position: 'absolute',
    top: 57,
    right: -25,
    zIndex: 1,
    border: '1px solid black',
    p: 1,
    bgcolor: 'background.paper',
    minWidth: 175,
    boxShadow: '0 1px 10px 0 rgba(0, 0, 0, .4)'
  };
  
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
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: 'relative' }}>
              <People color="black" className={styles.peopleIcon} onClick={handleClick}/>
              {open ? (
                <Box className={styles.dropdown} onClick={handleClickAway} sx={dropdownProps}>
                  <Link href='/minskole'> Min skole </Link>
                  <Link href='/login'> Logg inn </Link>  
                </Box>
              ) : null}
            </Box>
          </ClickAwayListener>
        </li>
        
      </ul>
      
    </nav>
  );
}

export default Header;
