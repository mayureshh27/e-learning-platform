import { Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link to={href} className="text-zinc-400 hover:text-white transition-colors text-sm">
                {children}
            </Link>
        </li>
    );
}

function SocialLink({ icon: Icon, href }: { icon: any; href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-violet-500 hover:text-white transition-all"
        >
            <Icon className="w-5 h-5" />
        </a>
    );
}

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-zinc-950 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-2">
                    <Logo className="mb-4" />
                    <p className="text-zinc-500 max-w-sm mb-6">
                        Forging the next generation of elite software engineers through deep, project-based learning.
                    </p>
                    <div className="flex gap-4">
                        <SocialLink icon={Github} href="https://github.com" />
                        <SocialLink icon={Twitter} href="https://twitter.com" />
                        <SocialLink icon={Linkedin} href="https://linkedin.com" />
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Platform</h4>
                    <ul className="space-y-4">
                        <FooterLink href="/courses">All Courses</FooterLink>
                        <FooterLink href="/paths">Learning Paths</FooterLink>
                        <FooterLink href="/pricing">Pricing</FooterLink>
                        <FooterLink href="/enterprise">Enterprise</FooterLink>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Company</h4>
                    <ul className="space-y-4">
                        <FooterLink href="/about">About Us</FooterLink>
                        <FooterLink href="/careers">Careers</FooterLink>
                        <FooterLink href="/blog">Blog</FooterLink>
                        <FooterLink href="/legal">Terms & Privacy</FooterLink>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-zinc-600 text-sm">
                © {new Date().getFullYear()} DevForge. All rights reserved.
            </div>
        </footer>
    );
}
