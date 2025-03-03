'use client';

import React from 'react';
import DashboardHeader from './DashboardHeader';

interface DashboardHeaderClientProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function DashboardHeaderClient({ user }: DashboardHeaderClientProps) {
  return <DashboardHeader user={user} />;
} 