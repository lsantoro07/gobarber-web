import React from 'react';

import { Container } from './styles';

interface TooltipProprs {
  title: string;
  className?: string;
}
const Tooltip: React.FC<TooltipProprs> = ({ className, title, children }) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default Tooltip;
