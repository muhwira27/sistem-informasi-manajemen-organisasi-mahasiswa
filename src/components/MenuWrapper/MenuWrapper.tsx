import { useLocation } from 'react-router-dom';
import Menu from '../Menu';

const MenuWrapper = () => {
  const location = useLocation();
  const showMenu = location.pathname !== '/login';

  return showMenu ? <Menu /> : null;
}

export default MenuWrapper;
