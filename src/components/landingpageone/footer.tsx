import React from 'react';
import Reveal from './Reveal'; // Import the client wrapper

const defaultFooterData = {
    logo: {
        src: "/logomain.avif",
        alt: "Petocare Logo"
    },
    quickLinks: {
        title: "Quick Link",
        links: [
            { label: "About", href: "#" },
            { label: "Services", href: "#" },
            { label: "Contact", href: "#" }
        ]
    },
    legal: {
        title: "Legal",
        links: [
            { label: "Terms & Condition", href: "#" },
            { label: "Privacy Policy", href: "#" }
        ]
    },
    info: {
        title: "Our Info",
        address: "2458 Oceanview Drive, Sunnyvale, CA 94085.",
        phone: { label: "+1-587-302-7481", href: "tel:+15873027481" },
        email: { label: "hello@Petocare.com", href: "mailto:hello@Petocare.com" }
    },
    copyright: "Copyright © 2026 Petocare. All right reserved."
};

export default function Footer({ data = defaultFooterData }) {
    return (
        <footer className="bg-[#FDFDFD] px-6 pt-28 pb-16 font-sans border-t border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-16">

                {/* Grid Links Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 items-start">

                    {/* Column 1: Logo */}
                    <Reveal animation="up" delay="delay-0">
                        <div className="flex items-center gap-3">
                            <a href="#" aria-label="Petocare Home" className="group">
                                <img src={data.logo.src} alt={data.logo.alt} className="w-40 h-11 object-contain" />
                            </a>
                        </div>
                    </Reveal>

                    {/* Column 2: Quick Links */}
                    <Reveal animation="up" delay="delay-150">
                        <nav aria-label="Quick links">
                            <h4 className="text-sm font-normal text-[#625B5B] mb-5 tracking-wide">{data.quickLinks.title}</h4>
                            <ul className="space-y-4">
                                {data.quickLinks.links.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.href} className="text-base font-medium text-[#1E0C05] hover:text-[#847E53] transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </Reveal>

                    {/* Column 3: Legal */}
                    <Reveal animation="up" delay="delay-300">
                        <nav aria-label="Legal documents">
                            <h4 className="text-sm font-normal text-[#625B5B] mb-5 tracking-wide">{data.legal.title}</h4>
                            <ul className="space-y-4">
                                {data.legal.links.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.href} className="text-base font-medium text-[#1E0C05] hover:text-[#847E53] transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </Reveal>

                    {/* Column 4: Contact Info */}
                    <Reveal animation="up" delay="delay-500">
                        <div>
                            <h4 className="text-sm font-normal text-[#625B5B] mb-5 tracking-wide">{data.info.title}</h4>
                            <address className="not-italic space-y-4 text-base font-normal text-[#1E0C05] leading-relaxed">
                                <p>{data.info.address}</p>
                                <p>
                                    <a href={data.info.phone.href} className="hover:text-[#847E53] transition-colors">
                                        {data.info.phone.label}
                                    </a>
                                </p>
                                <p>
                                    <a href={data.info.email.href} className="hover:text-[#847E53] transition-colors">
                                        {data.info.email.label}
                                    </a>
                                </p>
                            </address>
                        </div>
                    </Reveal>

                </div>

                {/* Bottom Bar (Fades up nicely after columns appear) */}
                <Reveal animation="up" delay="delay-700" className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[#625B5B] text-center sm:text-left">
                        {data.copyright}
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-2.5">
                        <a href="#" aria-label="Facebook" className="w-[26px] h-[26px] bg-[#847E53] text-white rounded-full flex items-center justify-center transition-transform hover:scale-105">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" /></svg>
                        </a>
                        <a href="#" aria-label="Pinterest" className="w-[26px] h-[26px] bg-[#847E53] text-white rounded-full flex items-center justify-center transition-transform hover:scale-105">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.27 2.68 7.91 6.46 9.35-.09-.8-.17-2.02.04-2.89.18-.78 1.16-4.93 1.16-4.93s-.3-.59-.3-1.46c0-1.37.79-2.39 1.78-2.39.84 0 1.25.63 1.25 1.39 0 .85-.54 2.11-.82 3.29-.23.98.49 1.78 1.46 1.78 1.75 0 3.1-1.85 3.1-4.51 0-2.36-1.69-4.01-4.11-4.01-2.8 0-4.44 2.1-4.44 4.27 0 .85.33 1.76.73 2.25.08.1.09.19.07.29-.08.32-.25 1.01-.28 1.15-.04.18-.14.22-.33.13-1.24-.58-2.02-2.4-2.02-3.87 0-3.15 2.29-6.04 6.6-6.04 3.46 0 6.16 2.47 6.16 5.77 0 3.44-2.17 6.21-5.18 6.21-1.01 0-1.97-.53-2.29-1.15l-.62 2.37c-.22.86-.83 1.94-1.24 2.61C10.66 21.84 11.32 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
                        </a>
                        <a href="#" aria-label="LinkedIn" className="w-[26px] h-[26px] bg-[#847E53] text-white rounded-full flex items-center justify-center transition-transform hover:scale-105">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </a>
                    </div>
                </Reveal>

            </div>
        </footer>
    );
}