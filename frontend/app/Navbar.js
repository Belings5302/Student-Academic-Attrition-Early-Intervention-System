'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, LayoutDashboard, Users, Sparkles, BookOpen, Activity } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/students', label: 'Student Directory', icon: Users },
    { href: '/predict', label: 'Risk Simulator', icon: Sparkles },
    { href: '/interventions', label: 'Intervention Matrix', icon: BookOpen },
  ];

  return (
    <header className="navbar">
      <Link href="/" className="nav-brand">
        <div className="brand-icon-box">
          <ShieldAlert size={22} strokeWidth={2.2} />
        </div>
        <div>
          <div className="brand-title">EarlyIntervene ML</div>
          <div className="brand-subtitle">Academic Attrition Prevention</div>
        </div>
      </Link>

      <nav className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="nav-status">
        <span className="status-dot"></span>
        <span>ML Engine: Logistic Reg (98.4% Acc)</span>
      </div>
    </header>
  );
}
