"use client";


import Link from 'next/link'

const Header = () => {
    return (
        <header style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid #ccc' }}>
            <h1 style={{ fontSize: '4rem' }}>Mizan</h1>
            <nav>
                <Link href='/dashboard'>Dashboard</Link>
            </nav>
        </header >
    );
};
export default Header;
