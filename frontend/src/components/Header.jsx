import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

/**
 * Header component with navigation and cart counter
 *
 * @param {Object} props
 * @param {number} props.cartCount - Number of items in cart
 */
function Header({ cartCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Location:", { location });

  const isCartActive = location.pathname === "/carrinho";

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
            className={({ isActive }) =>
              `header__link ${isActive ? "header__link--active" : ""}`
            }
          >
            Menu
          </NavLink>
          <NavLink
            to="/lojas"
            className={({ isActive }) =>
              `header__link ${isActive ? "header__link--active" : ""}`
            }
          >
            Lojas
          </NavLink>

          {/* Programmatic navigation example using useNavigate */}
          <button
            type="button"
            onClick={() => navigate("/carrinho")}
            className={`header__cart ${isCartActive ? "header__cart--active" : ""}`}
            aria-label="Abrir carrinho"
          >
            <span className="header__cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="header__cart-badge">{cartCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
