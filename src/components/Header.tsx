import React, { useMemo } from 'react';
import CardNav from './CardNav/CardNav';
import { useConfig } from '../context/ConfigContext';
import { useCart } from '../context/CartContext';
import { signOut, supabase } from '../utils/supabase';

interface HeaderProps {
  onSignInClick: () => void;
  mode: 'light' | 'dark';
  onToggleMode: () => void;
}

export default function Header({ onSignInClick, mode, onToggleMode }: HeaderProps) {
  const { user, setUser } = useConfig();
  const { totalItems } = useCart();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        setIsAdmin(data?.is_admin || false);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Always clear local user state regardless of server response.
      setUser(null);
    }
  };

  const navItems = useMemo(() => [
    {
      label: 'Shop',
      bgColor: '#3b1520',
      textColor: '#fff',
      links: [
        { label: 'Home', path: '/', ariaLabel: 'Go to Home' },
        { label: 'Customize', path: '/customize', ariaLabel: 'Customize a product' },
        { label: 'Cart', path: '/cart', ariaLabel: 'View cart' },
      ],
    },
    {
      label: 'Orders',
      bgColor: '#2a1018',
      textColor: '#fff',
      links: isAdmin
        ? [{ label: 'Admin Dashboard', path: '/admin', ariaLabel: 'Go to Admin Dashboard' }]
        : user
          ? [{ label: 'Order History', path: '/history', ariaLabel: 'View order history' }]
          : [{ label: 'Sign in to view orders', path: '__signin__', ariaLabel: 'Sign in to view orders' }],
    },
    {
      label: 'Account',
      bgColor: '#1b0d11',
      textColor: '#fff',
      links: user
        ? [
            { label: 'My Profile', path: '/profile', ariaLabel: 'Go to profile' },
            { label: 'Sign Out', path: '__signout__', ariaLabel: 'Sign out of account' },
          ]
        : [{ label: 'Sign In', path: '__signin__', ariaLabel: 'Sign in to account' }],
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [user, isAdmin]);

  return (
    <CardNav
      items={navItems}
      totalItems={totalItems}
      user={user}
      onSignInClick={onSignInClick}
      onSignOut={handleSignOut}
      mode={mode}
      onToggleMode={onToggleMode}
    />
  );
}
