import React from 'react';
import { Button, Tooltip } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { usePermissions } from '../../hooks/usePermissions';

interface PermissionButtonProps extends ButtonProps {
  module: string;
  action: string;
  tooltipDenied?: string;
}

/**
 * Botão que verifica permissões antes de renderizar
 * Se usuário não tem permissão, botão fica desabilitado com tooltip
 */
const PermissionButton: React.FC<PermissionButtonProps> = ({
  module,
  action,
  tooltipDenied = 'Você não tem permissão para esta ação',
  children,
  ...buttonProps
}) => {
  const { canDoAction } = usePermissions();
  const hasPermission = canDoAction(module, action);

  if (!hasPermission) {
    return (
      <Tooltip title={tooltipDenied}>
        <Button {...buttonProps} disabled>
          {children}
        </Button>
      </Tooltip>
    );
  }

  return <Button {...buttonProps}>{children}</Button>;
};

export default PermissionButton;

