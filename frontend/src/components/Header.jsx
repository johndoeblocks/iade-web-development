import { Link, NavLink } from 'react-router-dom';
import './Header.css';

/**
 * Header component with navigation and cart counter
 * 
 * @param {Object} props
 * @param {number} props.cartCount - Number of items in cart
 */
function Header({ cartCount = 0 }) {
  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">🍕</span>
          <span className="header__logo-text">Padre Gino's</span>
        </Link>
        
        <nav className="header__nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
          >
            Menu
          </NavLink>
          <NavLink 
            to="/lojas" 
            className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
          >
            Lojas
          </NavLink>
         
          <NavLink 
            to="/carrinho" 
            className={({ isActive }) => `header__cart ${isActive ? 'header__cart--active' : ''}`}
          >
            <span className="header__cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="header__cart-badge">{cartCount}</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
