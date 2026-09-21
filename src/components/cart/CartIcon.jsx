import { useCart } from '../../context/CartContext';
export default function CartIcon({ onClick }) {
    const { itemCount } = useCart();
    return (<button onClick={onClick} className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-muted transition-colors" aria-label="Cart" title="Cart">
      <span className="text-xl" aria-hidden>🛒</span>
      {itemCount > 0 && (<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-text-inverse text-[10px] font-bold flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>)}
    </button>);
}
