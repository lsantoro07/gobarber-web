import React, { ButtonHTMLAttributes } from 'react';
import { Container } from './styles';

/** Quando criamos interface extendidas e não adicionamos e nem sobrescrevemos novas
 * propriedades, é feito pelo type, conforme na sintaxe abaixo:
 * */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};
const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
