'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../css/Navbar.css'

const links = [
    { href: '/todo-list', label: 'Todos' },
    { href: '/products', label: 'Products' },
    { href: '/profile', label: 'Profile' },
]

export default function Navbar() {
    const pathname = usePathname()

    return (
        <nav className="navbar">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={pathname === link.href ? 'active' : ''}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    )
}