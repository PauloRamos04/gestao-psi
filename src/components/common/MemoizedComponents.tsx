/**
 * Componentes otimizados com React.memo para evitar re-renderizações desnecessárias
 */

import React from 'react';
import { Card, Statistic, Avatar } from 'antd';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
  valueStyle?: React.CSSProperties;
}

// Card de estatística memoizado
export const MemoizedStatCard = React.memo<StatCardProps>(({ 
  title, 
  value, 
  icon, 
  prefix, 
  suffix,
  valueStyle 
}) => (
  <Card>
    <Statistic
      title={title}
      value={value}
      prefix={icon}
      suffix={suffix}
      valueStyle={valueStyle}
    />
  </Card>
));

MemoizedStatCard.displayName = 'MemoizedStatCard';

interface AvatarGroupProps {
  users: Array<{ id: number; nome: string; fotoUrl?: string }>;
  max?: number;
}

// Grupo de avatares memoizado
export const MemoizedAvatarGroup = React.memo<AvatarGroupProps>(({ users, max = 3 }) => (
  <Avatar.Group maxCount={max} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
    {users.map((user) => (
      <Avatar key={user.id} src={user.fotoUrl}>
        {user.nome.charAt(0).toUpperCase()}
      </Avatar>
    ))}
  </Avatar.Group>
));

MemoizedAvatarGroup.displayName = 'MemoizedAvatarGroup';

