import { Zap } from 'lucide-react';

export function Logo({ className = "", iconClassName = "w-5 h-5" }: { className?: string, iconClassName?: string }) {
    return (
        <div className={`flex items-center gap-2 group ${className}`}>
            <div className="p-2 bg-violet-600 border-2 border-white shadow-[2px_2px_0px_0px_#ffffff80] group-hover:shadow-none bg-gradient-to-br from-violet-500 to-fuchsia-600 transition-all transform group-hover:rotate-3">
                <Zap className={`${iconClassName} text-white fill-current`} />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                DEVF<span className="text-violet-500">ORGE</span>
            </span>
        </div>
    );
}
