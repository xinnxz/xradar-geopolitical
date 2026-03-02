// ========================================
// ShareBar — Social share buttons
// Twitter/X, WhatsApp, Telegram, Copy Link
// ========================================

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Share2, Check, Link2 } from 'lucide-react';
import './ShareBar.css';

const BASE_URL = 'https://globalwar.live';

const PAGE_TITLES = {
    '/': 'Real-time Geopolitical & Market Intelligence',
    '/markets': 'Live Crypto, Stocks, Forex & Commodities',
    '/news': 'Breaking Geopolitical News',
    '/map': 'Live Armed Conflict Map',
    '/risk': 'Geopolitical Risk Index',
    '/about': 'About GlobalWar.live',
};

export default function ShareBar() {
    const { pathname } = useLocation();
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);

    const url = `${BASE_URL}${pathname === '/' ? '' : pathname}`;
    const title = PAGE_TITLES[pathname] || PAGE_TITLES['/'];
    const text = `${title} — GlobalWar.live`;

    const shareLinks = [
        {
            name: 'Twitter',
            icon: (
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        },
        {
            name: 'WhatsApp',
            icon: (
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            href: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
        },
        {
            name: 'Telegram',
            icon: (
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
            ),
            href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        },
    ];

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="share-bar">
            <button
                className="share-bar__trigger"
                onClick={() => setOpen(!open)}
                title="Share this page"
            >
                <Share2 size={16} />
            </button>

            {open && (
                <div className="share-bar__dropdown fade-in">
                    {shareLinks.map(link => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="share-bar__item"
                            title={`Share on ${link.name}`}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </a>
                    ))}
                    <button className="share-bar__item" onClick={copyLink}>
                        {copied ? <Check size={15} /> : <Link2 size={15} />}
                        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
