import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsOpen(false);
    };

    // Links that show for everyone
    const publicLinks = ['Courses'];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-panel border-b-0 border-white/5 bg-zinc-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                {/* Logo */}
                <Link to="/">
                    <Logo />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {publicLinks.map((item) => (
                        <Link
                            key={item}
                            to={`/${item.toLowerCase()}`}
                            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors uppercase tracking-widest relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-violet-500 transition-all group-hover:w-full" />
                        </Link>
                    ))}

                    {isAuthenticated && (
                        <Link
                            to="/dashboard"
                            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors uppercase tracking-widest relative group"
                        >
                            Dashboard
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-violet-500 transition-all group-hover:w-full" />
                        </Link>
                    )}
                    {isAuthenticated && user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-widest relative group"
                        >
                            Admin
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-violet-500 transition-all group-hover:w-full" />
                        </Link>
                    )}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {isLoading ? (
                        <div className="w-20 h-8 bg-zinc-800 animate-pulse rounded" />
                    ) : isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <User className="w-4 h-4" />
                                <span className="font-medium text-white">{user?.name}</span>
                            </div>
                            <Button variant="ghost" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost">Log In</Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="primary">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-zinc-950 border-t border-white/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-6 items-center justify-center h-full">
                            {publicLinks.map((item) => (
                                <Link
                                    key={item}
                                    to={`/${item.toLowerCase()}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-2xl font-bold text-zinc-300 hover:text-white uppercase tracking-widest"
                                >
                                    {item}
                                </Link>
                            ))}
                            {isAuthenticated && (
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="text-2xl font-bold text-zinc-300 hover:text-white uppercase tracking-widest"
                                >
                                    Dashboard
                                </Link>
                            )}
                            {isAuthenticated && user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="text-2xl font-bold text-violet-400 hover:text-violet-300 uppercase tracking-widest"
                                >
                                    Admin
                                </Link>
                            )}

                            <div className="flex flex-col gap-4 w-full mt-8">
                                {isAuthenticated ? (
                                    <>
                                        <div className="text-center text-zinc-400 mb-2">
                                            <User className="w-5 h-5 inline mr-2" />
                                            <span className="font-medium text-white">{user?.name}</span>
                                        </div>
                                        <Button className="w-full" variant="outline" onClick={handleLogout}>
                                            <LogOut className="w-4 h-4 mr-2" /> Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full" variant="outline">Log In</Button>
                                        </Link>
                                        <Link to="/signup" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full" variant="primary">Get Started</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
