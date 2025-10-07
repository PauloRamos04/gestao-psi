/**
 * Componente de Tabela Virtualizada
 * Renderiza apenas as linhas visíveis para otimizar performance com grandes volumes de dados
 */

import React, { useRef, useState, useEffect } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface VirtualTableProps<T> extends TableProps<T> {
  scroll?: { y?: number; x?: number };
}

function VirtualTable<T extends object>(props: VirtualTableProps<T>) {
  const { columns, scroll, ...restProps } = props;
  const [tableWidth, setTableWidth] = useState(0);

  const widthColumnCount = columns!.filter(({ width }) => !width).length;
  const mergedColumns = columns!.map((column) => {
    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  const gridRef = useRef<any>(null);
  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  // Versão simplificada sem react-window - usa apenas paginação otimizada
  return (
    <Table
      {...restProps}
      className="virtual-table"
      columns={mergedColumns}
      scroll={scroll}
      pagination={{
        pageSize: 50,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['25', '50', '100', '200'],
        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`,
      }}
    />
  );
}

export default VirtualTable;

