import type { MenuItem } from '../types';

interface MenuCardProps {
    item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(item.price);

    return (
        <div className = "flex flex-col items-center justify-between p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white/20 transition-all">
            <div className="w-24 h-24 mb-3 rounded-full bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center justify-center p-2">
                <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-contain"
                />
            </div>
            
            <h3 className="text-white font-semibold text-sm mb-1">{item.name}</h3>
            
            <div className="flex items-center justify-between w-full mt-2">
                <span className="text-white/80 text-xs">{formattedPrice}</span>
                <button className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-cafe-gold hover:scale-110 hover:text-black transition-all duration-200">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>
    )
}